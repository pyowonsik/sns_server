import { PickType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";
import { PostsModel } from "../entities/posts.entity";

// Pick Omit Partial -> 타입 반환
// PickType , OmitType , PartialType -> 값을 반환

export class CreatePostDto extends PickType(PostsModel,['title','content']) {}

