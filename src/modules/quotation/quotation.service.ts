import puppeteer from "puppeteer";
import * as fs from "fs";
import * as ejs from "ejs";
import { Injectable, Logger } from '@nestjs/common';
import { FileVisibility, Leads, Organization, Prisma, Project, Quotation } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Pagination, ResponseError } from 'src/common-types/common-types';
import { PrismaService } from 'src/prisma.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { QuotationFiltersDto } from './dto/quotation-filters.dto';
import { MailService } from 'src/mail/mail.service';
import { AuthenticatedUser } from 'src/authentication/jwt-payload';
import { UserDefaultAttributes } from '../user/dto/user.dto';
import { QuotationStatusDto } from './dto/quotation-status.dto';
import { FileStatus, KnownProjectStatus, LeadsStatus, MilestoneStatus, QuotationStatus, SupervisionPaymentSchedule, VAT_RATE } from 'src/config/constants';
import { getDynamicUploadPath } from "./dto/quotation.dto";
import { uploadFile } from "src/helpers/file-management";
import { existsSync, mkdirSync } from "fs";
import { OrganizationDefaultAttributes } from "../organization/dto/organization.dto";
import { addDaysToCurrentDate, addDaysToDate, convertDate, extractIds, getEnumKeyByEnumValue, getTaxData, slugify } from "src/helpers/common";
import { ClientDefaultAttributes } from "../client/dto/client.dto";
import { AutoCreateProjectDto } from "./dto/auto-create-project-from-quote.dto";
import { NotificationEventDto } from "../notification/dto/notification.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ProjectDocumentsTypes } from "../project/entities/project.entity";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { XeroProcessNames } from "../xero-accounting/process/xero.process.config";
import { CheckQuoteDuplicacyDto } from "./dto/check-quote-number-duplicacy.dto";
import { QuickUpdateQuotation } from "./dto/quick-update.dto";

@Injectable()
export class QuotationService {

  private readonly logger = new Logger(QuotationService.name);
  constructor(private prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue('xero') private xeroQueue: Queue
  ) {
  }

  async create(createDto: CreateQuotationDto, user: AuthenticatedUser) {
    const { milestone, submissionById, revisedQuotationReferenceId, ...rest } = createDto;

    let leadData: Leads & { Project: Project, SubmissionBy: Partial<Organization> };
    if (createDto.leadId) {
      leadData = await this.prisma.leads.findFirst({
        where: {
          id: createDto.leadId
        },
        include: {
          Project: true,
          SubmissionBy: {
            select: OrganizationDefaultAttributes
          }
        }
      })
    }

    if (!leadData && createDto.clientId) {
      leadData = await this.prisma.leads.create({
        data: {
          clientId: createDto.clientId,
          message: "Auto Created from Quotation",
          submissionById: submissionById
        },
        include: {
          Project: true,
          SubmissionBy: {
            select: OrganizationDefaultAttributes
          }
        }
      })
    }

    if (!leadData) {
      throw {
        message: "No Lead Data Found",
        statusCode: 400
      }
    }

    if (!leadData.submissionById && !submissionById) {
      throw {
        message: "Please provide Submission Company, either it is DAT, Luxedesign or any other",
        statusCode: 400
      }
    }

    if (submissionById && leadData.submissionById !== submissionById) {
      leadData = await this.prisma.leads.update({
        where: {
          id: createDto.leadId
        },
        data: {
          submissionById: submissionById
        },
        include: {
          Project: true,
          SubmissionBy: {
            select: OrganizationDefaultAttributes
          }
        }
      })
    }

    let totalAmount = 0;
    let vatAmount = 0;
    let vatData = new Map<number, { rate: number }>();

    // milestone.forEach((ele) => {
    //   totalAmount = totalAmount + (ele.quantity * ele.amount);
    // })
    let quotationMileStone: Array<Prisma.QuotationMilestoneUncheckedCreateInput> = []
    for (let i = 0; i < milestone.length; i++) {
      let ele = milestone[i];
      let lineAmount = (ele.quantity * ele.amount);
      let lineVatAmount = 0;
      totalAmount = totalAmount + lineAmount;
      if (ele.taxRateId) {
        let rate = 0;
        if (vatData.has(ele.taxRateId)) {
          rate = vatData.get(ele.taxRateId).rate;
        } else {
          let vt = await this.prisma.taxRate.findFirst({
            where: { id: ele.taxRateId }
          })
          rate = vt.rate;
          vatData.set(ele.taxRateId, { rate: rate });
        }
        lineVatAmount = (rate / 100) * lineAmount
        vatAmount += lineVatAmount;
      }
      quotationMileStone.push({
        ...ele,
        taxAmount: lineVatAmount
      })
    }

    // vatAmount = (VAT_RATE / 100) * totalAmount;

    let previousQuotation: Quotation = null;
    if (revisedQuotationReferenceId) {
      previousQuotation = await this.prisma.quotation.findFirst({
        where: {
          id: revisedQuotationReferenceId
        }
      })
    }

    let newQuotation = await this.prisma.quotation.create({
      data: {
        ...rest,
        addedById: user.userId,
        xeroTenantId: leadData?.xeroTenantId,
        leadId: leadData.id,
        subTotal: totalAmount,
        vatAmount: vatAmount,
        total: totalAmount + vatAmount,
        projectId: (leadData && leadData?.Project) ? leadData?.Project?.id : undefined,
        revisedQuotationReferenceId: (previousQuotation) ? previousQuotation.id : undefined,
        revisionCount: (previousQuotation) ? previousQuotation.revisionCount + 1 : 0,
        brandingThemeId: createDto.brandingThemeId,
        QuotationMilestone: {
          createMany: {
            data: quotationMileStone.map(({ id, ...rest }) => rest)
          }
        }
      },
    })
      .catch((err: PrismaClientKnownRequestError) => {
        this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
        let errorResponse: ResponseError = { message: err.message, statusCode: 400, data: {} }
        throw errorResponse;
      })

    if (newQuotation && previousQuotation) {
      let previousQuotationData = await this.prisma.quotation.update({
        where: {
          id: previousQuotation.id
        },
        data: {
          status: QuotationStatus.revised
        }
      })

      this.xeroQueue.add(XeroProcessNames.updateQuotationStatus, {
        message: "Sync Quotation With Xero",
        data: previousQuotationData
      }, { removeOnComplete: true })

    }

    this.xeroQueue.add(XeroProcessNames.syncQuotation, {
      message: "Sync Quotation With Xero",
      data: newQuotation
    }, { removeOnComplete: true })

    return newQuotation
  }

  findAll(pagination: Pagination, condition: Prisma.QuotationWhereInput) {

    let skip = (pagination.perPage * (pagination.page - 1));
    let take = pagination.perPage;
    let records = this.prisma.quotation.findMany({
      where: condition,
      skip: skip,
      take: take,
      include: {
        QuotationMilestone: {
          orderBy: {
            id: 'asc'
          }
        },
        Lead: {
          select: {
            ProjectType: {
              select: {
                id: true,
                slug: true,
                title: true
              }
            },
            SubmissionBy: {
              select: OrganizationDefaultAttributes
            },
            Client: {
              select: ClientDefaultAttributes
            },
            LeadEnquiryFollowUp: {
              where: {
                isDeleted: false
              },
              include: {
                AddedBy: {
                  select: UserDefaultAttributes
                }
              },
              take: 3,
              orderBy: {
                addedDate: 'desc'
              }
            },
            AssignedTo: {
              select: UserDefaultAttributes
            }
          },
        },
      },
      orderBy: {
        addedDate: 'desc'
      }
    });
    return records;
  }

  findOne(id: number) {
    return this.prisma.quotation.findUnique({
      where: {
        id: id
      },
      include: {
        QuotationMilestone: {
          include: {
            Account: {
              select: {
                id: true,
                accountCode: true,
                title: true
              }
            },
            TaxRate: {
              select: {
                id: true,
                taxType: true,
                title: true
              }
            },
            Product: {
              select: {
                id: true,
                title: true,
                productCode: true
              }
            }
          },
          orderBy: {
            id: 'asc'
          }
        },
        Lead: {
          select: {
            ProjectType: {
              select: {
                id: true,
                slug: true,
                title: true
              }
            },
            SubmissionBy: {
              select: OrganizationDefaultAttributes
            },
            Client: {
              select: ClientDefaultAttributes
            },
            LeadEnquiryFollowUp: {
              where: {
                isDeleted: false
              },
              include: {
                AddedBy: {
                  select: UserDefaultAttributes
                }
              },
              take: 3,
              orderBy: {
                addedDate: 'desc'
              }
            },
            AssignedTo: {
              select: UserDefaultAttributes
            }
          },
        },
      },
    }).catch((err: PrismaClientKnownRequestError) => {
      this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
      let errorResponse: ResponseError = { message: err.message, statusCode: 400, data: {} }
      throw errorResponse;
    })
  }

  async update(id: number, updateDto: UpdateQuotationDto, user: AuthenticatedUser) {
    const { milestone, revisedQuotationReferenceId, submissionById, ...rest } = updateDto;
    let recordData = await this.findOne(id);
    if (recordData.status !== QuotationStatus.created) {
      throw {
        message: "You cannot modify the quotation once it is sent to client. Please mark as rejected and recreate the new quotation",
        statusCode: 400
      }
    }

    let updatedRecord = await this.prisma.quotation.update({
      data: {
        ...rest,
        modifiedById: user.userId,
        modifiedDate: new Date()
      },
      where: {
        id: id
      }
    })

    if (milestone) {
      let allIds = [];
      milestone.forEach((ele) => {
        if (ele.id) {
          allIds.push(ele.id)
        }
      })

      await this.prisma.quotationMilestone.deleteMany({
        where: {
          quotationId: updatedRecord.id,
          NOT: {
            id: {
              in: allIds
            }
          }
        }
      })

      let newMileStone = [];
      let vatData = new Map<number, { rate: number }>();
      for (let i = 0; i < milestone.length; i++) {
        let ele = milestone[i];
        let lineAmount = (ele.quantity * ele.amount);
        let lineVatAmount = 0;

        if (ele.taxRateId) {
          let rate = 0;
          if (vatData.has(ele.taxRateId)) {
            rate = vatData.get(ele.taxRateId).rate;
          } else {
            let vt = await this.prisma.taxRate.findFirst({
              where: { id: ele.taxRateId }
            })
            rate = vt.rate;
            vatData.set(ele.taxRateId, { rate: rate });
          }
          lineVatAmount = (rate / 100) * lineAmount
        }

        if (ele.id) {
          let t = this.prisma.quotationMilestone.update({
            where: {
              id: ele.id
            },
            data: {
              quotationId: updatedRecord.id,
              amount: ele.amount,
              taxAmount: lineVatAmount,
              taxRateId: ele.taxRateId,
              accountId: ele.accountId,
              productId: ele.productId,
              quantity: ele.quantity,
              title: ele.title,
              requirePayment: ele.requirePayment
            }
          })
          newMileStone.push(t)
        } else {
          let t = this.prisma.quotationMilestone.create({
            data: {
              taxRateId: ele.taxRateId,
              accountId: ele.accountId,
              productId: ele.productId,
              quotationId: updatedRecord.id,
              quantity: ele.quantity,
              amount: ele.amount,
              taxAmount: lineVatAmount,
              title: ele.title,
              requirePayment: ele.requirePayment
            }
          })
          newMileStone.push(t)
        }
      }
      await Promise.all(newMileStone);
    }
    await this.adjustTotalAmount(updatedRecord.id);

    this.xeroQueue.add(XeroProcessNames.syncQuotation, {
      message: "Sync Quotation With Xero",
      data: updatedRecord
    }, { removeOnComplete: true })

    return this.findOne(updatedRecord.id);
  }

  async adjustTotalAmount(quotationId: number) {
    let milestones = await this.prisma.quotationMilestone.findMany({
      where: {
        quotationId: quotationId
      },
      select: {
        quantity: true,
        amount: true,
        taxAmount: true
      }
    })

    let totalAmount = 0;
    let vatAmount = 0;
    milestones.forEach((ele) => {
      totalAmount = totalAmount + (ele.quantity * ele.amount);
      vatAmount = vatAmount + ele.taxAmount
    })

    return this.prisma.quotation.update({
      where: {
        id: quotationId
      },
      data: {
        subTotal: totalAmount,
        vatAmount: vatAmount,
        total: totalAmount + vatAmount
      }
    })
  }

  applyFilters(filters: QuotationFiltersDto, user: AuthenticatedUser, readAllQuotation: boolean) {
    let condition: Prisma.QuotationWhereInput = {
      isDeleted: false
    };

    if (Object.entries(filters).length > 0) {
      if (filters.__status) {
        condition = {
          ...condition, status: {
            in: filters.__status
          }
        }
      }

      if (filters.id) {
        condition = {
          ...condition,
          id: filters.id
        }
      }

      if (filters.assignedToId) {
        condition = {
          ...condition,
          Lead:{
            assignedToId: filters.assignedToId
          }
        }
      }


      if (filters.clientId) {
        condition = {
          ...condition, Lead: {
            clientId: filters.clientId
          }
        }
      }

      if (filters.quoteNumber) {
        condition = {
          ...condition, quoteNumber: {
            contains: filters.quoteNumber,
            mode: 'insensitive'
          }
        }
      }

      if (filters.projectTypeId) {
        condition = {
          ...condition, Lead: {
            projectTypeId: filters.projectTypeId
          }
        }
      }
      if (filters.projectId) {
        condition = {
          ...condition, projectId: filters.projectId
        }
      }

      if (filters.fromDate && filters.toDate) {
        condition = {
          ...condition, AND: [
            {
              addedDate: {
                gte: new Date(filters.fromDate + "T00:00:00")
              }
            },
            {
              addedDate: {
                lte: new Date(filters.toDate + "T23:59:59")
              }
            }
          ]
        }
      } else {
        if (filters.fromDate) {
          condition = { ...condition, addedDate: { gte: new Date(filters.fromDate + "T00:00:00") } }
        }

        if (filters.toDate) {
          condition = { ...condition, addedDate: { lte: new Date(filters.toDate + "T23:59:59") } }
        }
      }
    }

      if (!readAllQuotation) {
        if(condition.AND){
          if(Array.isArray(condition.AND)){
            condition.AND.push({
              OR: [
                { addedById: user.userId },
                {
                  Lead: {
                    OR: [
                      { addedById: user.userId },
                      { assignedToId: user.userId }
                    ]
                  }
                }
              ]
            })
          }else{
            condition.AND = [
              condition.AND,
              {
                OR: [
                  { addedById: user.userId },
                  {
                    Lead: {
                      OR: [
                        { addedById: user.userId },
                        { assignedToId: user.userId }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        }else{
          condition = {
            ...condition,
            AND: {
              OR: [
                { addedById: user.userId },
                {
                  Lead: {
                    OR: [
                      { addedById: user.userId },
                      { assignedToId: user.userId }
                    ]
                  }
                }
              ]
            }
          }
        }
      }else{
        if(user.litmitAccessTo && user.litmitAccessTo.length > 0){
          if(condition.AND){
            if(Array.isArray(condition.AND)){
              condition.AND.push({
                OR: [
                  { addedById: user.userId },
                  {
                    Lead: {
                      submissionById: {
                        in: user.litmitAccessTo
                      }
                    }
                  }
                ]
              })
            }else{
              condition.AND = [
                condition.AND,
                {
                  OR: [
                    { addedById: user.userId },
                    {
                      Lead: {
                        submissionById: {
                          in: user.litmitAccessTo
                        }
                      }
                    }
                  ]
                }
              ]
            }
          }else{
            condition = {
              ...condition,
              AND: {
                OR: [
                  { addedById: user.userId },
                  {
                    Lead: {
                      submissionById: {
                        in: user.litmitAccessTo
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }

    return condition
  }

  countTotalRecord(filters: Prisma.QuotationWhereInput) {
    return this.prisma.quotation.count({
      where: filters
    })
  }

  async submitQuotation(quotationId: number, user: AuthenticatedUser) {
    let recordData = await this.findOne(quotationId);
    if (recordData.status !== QuotationStatus.created) {
      throw {
        message: "This quotation has already been submitted",
        statusCode: 400
      }
    }

    let updatedRecord = await this.prisma.quotation.update({
      where: {
        id: quotationId
      },
      data: {
        status: QuotationStatus.submitted,
        sentDate: new Date(),
        Lead: {
          update: {
            status: LeadsStatus.in_progress
          }
        }
      }
    })

    this.xeroQueue.add(XeroProcessNames.updateQuotationStatus, {
      message: "Sync Quotation With Xero",
      data: updatedRecord
    }, { removeOnComplete: true })

    if(recordData?.Lead?.Client?.email){
      this.mailService.sendQuotationToClient(recordData, user);
    }

  }

  async updateStatus(quotationId: number, quotationStatusDto: QuotationStatusDto) {
    let dt = await this.prisma.quotation.findUniqueOrThrow({
      where: {
        id: quotationId
      }
    });

    if (!(dt.status === QuotationStatus.created || dt.status === QuotationStatus.submitted)) {
      throw {
        message: `This quotation has been already ${getEnumKeyByEnumValue(QuotationStatus, dt.status)}. You can no longer approve or reject this quotation.`,
        statusCode: 400
      }
    }

    let recordData = await this.prisma.quotation.update({
      where: {
        id: quotationId
      },
      data: quotationStatusDto
    })

    if (quotationStatusDto.status === QuotationStatus.confirmed) {
      await this.prisma.leads.update({
        where: {
          id: recordData.leadId
        },
        data: {
          status: LeadsStatus.confirmed
        }
      })

      let emitterData = new NotificationEventDto({ recordId: quotationId, moduleName: 'quotationApproved' });
      this.eventEmitter.emit('notification.send', emitterData);
    }

    this.xeroQueue.add(XeroProcessNames.updateQuotationStatus, {
      message: "Sync Quotation With Xero",
      data: recordData
    }, { removeOnComplete: true })

    return recordData;
  }


  async markAsSent(quotationId: number, user: AuthenticatedUser) {
    let recordData = await this.findOne(quotationId);
    if (recordData.status !== QuotationStatus.created) {
      throw {
        message: "This quotation has already been submitted",
        statusCode: 400
      }
    }

    let updatedRecord = await this.prisma.quotation.update({
      where: {
        id: quotationId
      },
      data: {
        status: QuotationStatus.submitted,
        sentDate: new Date(),
        Lead: {
          update: {
            status: LeadsStatus.in_progress
          }
        }
      }
    })

    this.xeroQueue.add(XeroProcessNames.updateQuotationStatus, {
      message: "Sync Quotation With Xero",
      data: updatedRecord
    }, { removeOnComplete: true })
  }

  removeQuotation(quotationId: number, user: AuthenticatedUser) {
    return this.prisma.quotation.update({
      where: {
        id: quotationId
      },
      data: {
        isDeleted: true,
        modifiedById: user.userId,
        modifiedDate: new Date()
      }
    })
  }

  viewQuotationPdf(quotationId: number) {
    return this.prisma.quotation.findUniqueOrThrow({
      where: {
        id: quotationId
      },
      include: {
        Lead: {
          include: {
            ProjectType:{
              select:{
                id: true,
                title: true,
                slug: true
              }
            },
            Client: true,
            SubmissionBy: {
              select: {
                ...OrganizationDefaultAttributes,
                taxRegistrationNumber: true,
                digitalStamp: true,
                address: true
              }
            }
          }
        },
        QuotationMilestone: {
          include: {
            TaxRate: {
              select: {
                title: true,
                rate: true,
                id: true
              }
            }
          },
          orderBy:{
            id: 'asc'
          }
        }
      }
    })
  }

  async generateQuotationPdf(quotationId: number) {
    let quotationData = await this.prisma.quotation.findUniqueOrThrow({
      where: {
        id: quotationId
      },
      include: {
        Lead: {
          include: {
            ProjectType:{
              select:{
                id: true,
                slug: true,
                title: true
              }
            },
            Client: true,
            SubmissionBy: {
              select: {
                ...OrganizationDefaultAttributes,
                taxRegistrationNumber: true,
                address: true,
                digitalStamp: true
              }
            }
          }
        },
        QuotationMilestone: {
          include: {
            TaxRate: {
              select: {
                title: true,
                rate: true,
                id: true
              }
            }
          },
          orderBy:{
            id: 'asc'
          }
        }
      }
    })

    let clientData = quotationData.Lead?.Client;
    let submissionBy = quotationData.Lead?.SubmissionBy;

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    const pageData = await fs.promises.readFile("views/pdf-templates/quotation.ejs", 'utf-8');
    const renderedContent = ejs.render(pageData, {
      clientData: clientData,
      quotation: quotationData,
      projectType: quotationData.Lead?.ProjectType,
      submissionBy: submissionBy,
      taxData: getTaxData(quotationData.QuotationMilestone),
      convertDate,
      addDaysToDate,
      getEnumKeyByEnumValue,
      SupervisionPaymentSchedule
    });
    // Set the content to render
    await page.setContent(renderedContent, { waitUntil: 'networkidle0', timeout: 10000 });
    // await page.waitForSelector('#puppetSelector');
    // await page.waitForNavigation();
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // Generate PDF from the rendered content
    let filename = "Quotation-" + slugify(clientData.name) + "-" + Date.now() + "__" + quotationData.id + ".pdf";
    let fileLocation = getDynamicUploadPath() + "/";
    let __fileLocation = process.cwd() + "/" + fileLocation;
    if (!existsSync(fileLocation)) {
      mkdirSync(fileLocation, { recursive: true });
    }
    await page.pdf({ path: fileLocation + filename });
    await browser.close();
    const fileToUpload: Express.Multer.File = {
      fieldname: "",
      filename: filename,
      size: 0,
      encoding: 'utf-8',
      mimetype: "application/pdf",
      destination: fileLocation,
      path: __fileLocation + filename,
      originalname: filename,
      stream: undefined,
      buffer: undefined

    }
    await uploadFile(fileToUpload);
    await this.prisma.quotation.update({
      where: {
        id: quotationId
      },
      data: {
        file: fileLocation + filename
      }
    })

    return this.findOne(quotationId);
  }

  async completeMilestone(milestoneId: number, user: AuthenticatedUser) {
    let milestoneData = await this.prisma.quotationMilestone.findUnique({
      where: {
        id: milestoneId
      },
      include: {
        Quotation: true
      }
    })

    if (milestoneData.status !== MilestoneStatus.not_completed) {
      if (milestoneData.status === MilestoneStatus.completed) {
        return milestoneData
      } else {
        throw {
          message: `This milestone was already completed and has been further processed.`,
          statusCode: 400
        }
      }
    }

    let updatedMilestoneData = await this.prisma.quotationMilestone.update({
      where: {
        id: milestoneId
      },
      data: {
        status: MilestoneStatus.completed,
        completedById: user.userId
      }
    })

    if (milestoneData.requirePayment) {
      await this.prisma.project.update({
        where: {
          id: milestoneData.Quotation.projectId
        },
        data: {
          onHold: true,
          comment: "Requires clearance from Finance (AUTO-HOLD)",
          ProjectHoldBy: {
            disconnect: true
          }
        }
      })

      let emitterData = new NotificationEventDto({ recordId: milestoneId, moduleName: 'milestoneCompleted' });
      this.eventEmitter.emit('notification.send', emitterData);

    }

    return updatedMilestoneData;
  }

  async autoCreateProjectFromApprovedQuotation(createDto: AutoCreateProjectDto, user: AuthenticatedUser) {
    let submissionById: number;
    let quoteData = await this.prisma.quotation.findFirst({
      where: {
        id: createDto.quoteId
      },
      include: {
        Lead: {
          include: {
            Project: true
          }
        },
        Project: true
      }
    })

    if (!quoteData || !quoteData.Lead) {
      throw {
        message: "No Quote / Lead data found",
        statusCode: 400
      }
    }

    if (quoteData.Lead.submissionById) {
      submissionById = quoteData.Lead.submissionById
    } else if (createDto.submissionById) {
      submissionById = createDto.submissionById
    }

    if (!submissionById) {
      throw {
        message: "Could not determine submitting company if it is DAT or Luxedesign",
        statusCode: 400
      }
    }

    let isAlreadyExist = await this.prisma.project.findFirst({
      where: {
        leadId: quoteData.Lead.id
      }
    })

    if (isAlreadyExist && isAlreadyExist.isDeleted === true) {
      await this.prisma.project.update({
        where: {
          id: isAlreadyExist.id,
        },
        data: {
          Lead: {
            disconnect: {}
          }
        }
      })

      isAlreadyExist = null;
    }

    if (isAlreadyExist) {
      let updatedQuoteData = await this.prisma.quotation.update({
        where: {
          id: createDto.quoteId
        },
        data: {
          status: QuotationStatus.confirmed,
          projectId: isAlreadyExist.id
        }
      })

      this.xeroQueue.add(XeroProcessNames.updateQuotationStatus, {
        message: "Sync Quotation With Xero",
        data: updatedQuoteData
      }, { removeOnComplete: true })


      if (quoteData.Lead && quoteData.Lead.status !== LeadsStatus.confirmed) {
        await this.prisma.leads.update({
          where: {
            id: quoteData.Lead.id
          },
          data: {
            submissionById: submissionById,
            projectTypeId: (createDto.projectTypeId) ? createDto.projectTypeId : undefined,
            status: LeadsStatus.confirmed,
            Project: (quoteData.Lead && !quoteData.Lead.Project) ?
              {
                connect: {
                  id: isAlreadyExist.id
                }
              } : undefined
          }
        })
      }

      let existingReference = isAlreadyExist.referenceNumber;
      let newRef =  quoteData.quoteNumber.replace("QU-", "");
      existingReference.replace(newRef,  "");
      let newReference = existingReference + " " + newRef;

      let projectEstimate = isAlreadyExist.projectEstimate + quoteData.total;
      await this.prisma.project.update({
        where: {
          id: isAlreadyExist.id
        }, data: {
          referenceNumber: newReference,
          projectEstimate: projectEstimate,
          submissionById: submissionById,
          projectTypeId: (createDto.projectTypeId) ? createDto.projectTypeId : undefined,
          xeroReference: (!isAlreadyExist.xeroReference && createDto.xeroReference) ? createDto.xeroReference : undefined
        }
      })

      this.xeroQueue.add(XeroProcessNames.syncProject, {
        message: "Sync Project With Xero",
        data: isAlreadyExist
      }, { removeOnComplete: true })

      if (quoteData.Lead?.representativeId && isAlreadyExist.clientId !== quoteData.Lead.representativeId) {
        await this.prisma.projectClient.upsert({
          where: {
            projectId_clientId: {
              clientId: quoteData.Lead.representativeId,
              projectId: isAlreadyExist.id
            }
          },
          create: {
            clientId: quoteData.Lead.representativeId,
            projectId: isAlreadyExist.id,
            isRepresentative: true
          },
          update: {
            isRepresentative: true
          }
        })
      }

      return isAlreadyExist;
    }

    let projectState = await this.prisma.projectState.findUnique({
      where: {
        slug: KnownProjectStatus.new
      }
    })

    let newProject = await this.prisma.project.create({
      data: {
        title: createDto.title,
        instructions: createDto.instructions,
        submissionById: createDto.submissionById,
        clientId: quoteData.Lead.clientId,
        addedById: user.userId,
        projectTypeId: quoteData.Lead.projectTypeId,
        leadId: quoteData.Lead.id,
        referenceNumber: quoteData.quoteNumber.replace("QU-", ""),
        projectEstimate: quoteData.total,
        projectStateId: (projectState) ? projectState.id : undefined,
        onHold: true,
        startDate: (createDto.startDate) ? createDto.startDate : undefined,
        endDate: (createDto.endDate) ? createDto.endDate : undefined,
        comment: "Requires clearance from Finance for Advance Payment (AUTO-HOLD)",
        xeroReference: createDto.xeroReference,
        xeroTenantId: quoteData.Lead.xeroTenantId
      }
    })

    this.xeroQueue.add(XeroProcessNames.syncProject, {
      message: "Sync Project With Xero",
      data: newProject
    }, { removeOnComplete: true })

    if (quoteData.Lead?.representativeId) {
      await this.prisma.projectClient.create({
        data: {
          projectId: newProject.id,
          clientId: quoteData.Lead.representativeId,
          isRepresentative: true
        }
      })
    }

    await this.prisma.leads.update({
      where: {
        id: quoteData.Lead.id
      },
      data: {
        submissionById: createDto.submissionById,
        projectTypeId: (createDto.projectTypeId) ? createDto.projectTypeId : undefined,
        Project: {
          connect: {
            id: newProject.id
          }
        },
        status: LeadsStatus.confirmed
      }
    })

    let allFiles = await this.prisma.enquiryAttachment.findMany({
      where: {
        leadId: quoteData.Lead.id
      }
    })

    let projectResources: Prisma.FileManagementUncheckedCreateInput[] = [];
    allFiles.forEach((ele) => {
      let t: Prisma.FileManagementUncheckedCreateInput = {
        title: ele.title,
        documentType: ProjectDocumentsTypes.other,
        name: ele.title,
        file: ele.file,
        fileType: ele.mimeType,
        path: ele.file,
        isTemp: false,
        status: FileStatus.Verified,
        addedById: user.userId,
        visibility: FileVisibility.organization,
        projectId: newProject.id,
        fileSize: ele.fileSize
      }
      projectResources.push(t);
    })

    if (projectResources.length > 0) {
      await this.prisma.fileManagement.createMany({
        data: projectResources
      })
    }

    let updatedQuotation = await this.prisma.quotation.update({
      where: {
        id: createDto.quoteId
      },
      data: {
        projectId: newProject.id,
        status: QuotationStatus.confirmed
      }
    })


    this.xeroQueue.add(XeroProcessNames.updateQuotationStatus, {
      message: "Sync Quotation Status With Xero",
      data: updatedQuotation
    }, { removeOnComplete: true })

    return updatedQuotation
  }

  async checkForDuplicacy(checkQuoteDuplicacyDto: CheckQuoteDuplicacyDto) {
    let condition: Prisma.QuotationWhereInput = {
      quoteNumber: checkQuoteDuplicacyDto.quoteNumber,
      isDeleted: false
    };

    if (checkQuoteDuplicacyDto.excludeId) {
      condition = {
        ...condition,
        id: {
          not: checkQuoteDuplicacyDto.excludeId
        }
      }
    }

    let recordData = await this.prisma.quotation.findFirst({
      where: condition
    })

    if (recordData) {
      return true
    } else {
      return false
    }

  }


  async prepareUniqueQuoteNumber(leadId?: number, revisionId?: number) {
    let leadData: Leads & { SubmissionBy: Partial<Organization> };
    if (leadId) {
      leadData = await this.prisma.leads.findFirst({
        where: {
          id: leadId
        },
        include: {
          SubmissionBy: {
            select: {
              organizationCode: true
            }
          }
        }
      })
    }

    if(!leadId && revisionId){
      leadData = await this.prisma.leads.findFirst({
        where: {
          Quotation:{
            some:{
              id: revisionId
            }
          }
        },
        include: {
          SubmissionBy: {
            select: {
              organizationCode: true
            }
          }
        }
      })
    }

    let prefix = "QU-" + ((leadData && leadData.SubmissionBy) ? leadData.SubmissionBy.organizationCode : "");
    let condition : Prisma.QuotationWhereInput = {
      isDeleted: false
    }

    if(leadData && leadData.submissionById){
      condition = {
        ...condition,
        Lead:{
          submissionById: leadData.submissionById
        }
      }
    }

    let lastQuote = await this.prisma.quotation.findFirst({
      where: condition,
      orderBy: {
        id: 'desc'
      }
    })

    if (lastQuote) {
      if (lastQuote?.quoteNumber) {
        let ids = extractIds(lastQuote.quoteNumber);
        if (ids.length > 0) {
          return prefix + String(ids[0] + 1).padStart(4, '0');
        } else {
          return prefix + String(lastQuote.id + 1).padStart(4, '0');
        }
      } else {
        return prefix + String(lastQuote?.id + 1).padStart(4, '0');
      }
    } else {
      return prefix + String(1).padStart(4, '0');
    }
  }

  async quickUpdate(quotationId: number, quickUpdateQuotation: QuickUpdateQuotation, user: AuthenticatedUser) {
    let recordData = await this.prisma.quotation.findUniqueOrThrow({
      where: {
        id: quotationId
      }
    })

    await this.prisma.leads.update({
      where: {
        id: recordData.leadId
      },
      data: {
        Project: {
          update: {
            projectTypeId: (quickUpdateQuotation.projectTypeId) ? quickUpdateQuotation.projectTypeId : undefined,
          },
          connect: {
            id: quickUpdateQuotation.projectId
          }
        },
        submissionById: quickUpdateQuotation.submissionById,
        projectTypeId: (quickUpdateQuotation.projectTypeId) ? quickUpdateQuotation.projectTypeId : undefined,
        Quotation: {
          updateMany: {
            where: {
              leadId: recordData.leadId
            },
            data: {
              projectId: quickUpdateQuotation.projectId
            }
          }
        }
      }
    })
    return this.findOne(quotationId);
  }
}

