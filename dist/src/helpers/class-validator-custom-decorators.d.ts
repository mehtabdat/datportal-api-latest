import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from "class-validator";
export declare class ValidateName implements ValidatorConstraintInterface {
    validate(value: string): Promise<boolean>;
    defaultMessage(args: ValidationArguments): string;
}
export declare class CustomDateValidator implements ValidatorConstraintInterface {
    validate(value: Date, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): any;
}
export declare function IsDateGreaterThan(property: string, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function IsDateGreaterThanToday(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare class IsEnumValue implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsEnumArray(enumType: object, validationOptions?: ValidationOptions): (object: Record<string, any>, propertyName: string) => void;
