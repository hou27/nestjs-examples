import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Configuration,
  CreateChatCompletionResponse,
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
    console.log({ question, model, temperature });
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

  async createChatCompletion({
    question,
    model,
    temperature,
  }: CreateCompletionBodyDto): Promise<CreateChatCompletionResponse> {
    try {
      const { data } = await this.openAIApi.createChatCompletion({
        model: model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: question,
          },
        ],
        temperature: temperature || 0.9,
      });

      return data;
    } catch (e) {
      throw e;
    }
  }
}
