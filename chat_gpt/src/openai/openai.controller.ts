import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { CreateCompletionBodyDto } from './dto/create-completion.dto';
import { CreateCompletionResponse } from 'openai';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post()
  async createCompletion(
    @Body() createCompletionBodyDto: CreateCompletionBodyDto,
  ): Promise<CreateCompletionResponse> {
    return this.openaiService.createCompletion(createCompletionBodyDto);
  }
}
