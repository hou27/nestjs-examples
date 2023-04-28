import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Configuration,
  CreateCompletionRequest,
  CreateCompletionResponse,
  OpenAIApi,
} from 'openai';
import { CreateCompletionBodyDto } from './dto/create-completion.dto';

@Injectable()
export class OpenaiService {
  private readonly openAIApi: OpenAIApi;
  constructor(private readonly configService: ConfigService) {
    this.openAIApi = new OpenAIApi(
      new Configuration({
        organization: this.configService.get('ORGANIZATION_ID'),
        apiKey: this.configService.get('OPENAI_API_KEY'),
      }),
    );
  }

  async createCompletion({
    question,
    model,
    temperature,
  }: CreateCompletionBodyDto): Promise<CreateCompletionResponse> {
    try {
      const { data } = await this.openAIApi.createCompletion({
        prompt: question,
        model: model || 'text-davinci-003',
        temperature: temperature || 0.9,
      });

      return data;
    } catch (e) {
      throw e;
    }
  }
}
