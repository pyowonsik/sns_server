import { PartialType, PickType } from "@nestjs/mapped-types";
import { IsString,IsOptional } from "class-validator";
import { StringValidationMessage } from "src/common/validation-message/string-validation.message";
import { CreatePostDto } from "./create-post.dto";

export class UpdatePostDto extends PartialType(CreatePostDto){


    @IsString({
        message : StringValidationMessage
    })
    @IsOptional()
    title? : string;

    @IsString({
        message : StringValidationMessage 
    })
    @IsOptional()
    content? : string ;
}