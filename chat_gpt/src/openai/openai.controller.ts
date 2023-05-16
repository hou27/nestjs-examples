import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { CreateCompletionBodyDto } from './dto/create-completion.dto';
import { CreateChatCompletionResponse, CreateCompletionResponse } from 'openai';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('/completion')
  async createCompletion(
    @Body() createCompletionBodyDto: CreateCompletionBodyDto,
  ): Promise<CreateCompletionResponse> {
    return this.openaiService.createCompletion(createCompletionBodyDto);
  }

  @Post('/chat-completion')
  async createChatCompletion(
    @Body() createCompletionBodyDto: CreateCompletionBodyDto,
  ): Promise<CreateChatCompletionResponse> {
    return this.openaiService.createChatCompletion(createCompletionBodyDto);
  }
}
