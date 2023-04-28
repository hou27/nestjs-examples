# OpenAI GPT Practice Repository with NestJS

This repository contains code and examples for practicing with OpenAI's GPT language model using the OpenAI API with NestJS.

## Getting Started

First, you'll need to set it as an environment variable:

`ORGANIZATION_ID`: ID of your OpenAI organization.
`OPENAI_API_KEY`: Your OpenAI API key.

and install dependencies

```bash
yarn install
```

Example:

### Request Body

```json
{
  "question": "What category does this link belong to: 'https://eomisae.co.kr/'? The categories are 'lifestyle', 'development', and 'laptop'.",
  "model": "text-davinci-003",
  "temperature": 0.9
}
```

### Response Body

```json
{
  "id": "cmpl-7ACJUqoXEJuFtTFTFCVLE4iabGgfI",
  "object": "text_completion",
  "created": 1682664968,
  "model": "text-davinci-003",
  "choices": [
    {
      "text": "\n\nLifestyle",
      "index": 0,
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 36,
    "completion_tokens": 4,
    "total_tokens": 40
  }
}
```

## Additional Resources

- [aton-py/chat-gpt-api](https://github.com/aton-py/chat-gpt-api): An example repository for building a chatbot API using OpenAI's GPT-3 language model and FastAPI.
- [OpenAI API Authentication Documentation](https://platform.openai.com/docs/api-reference/authentication): Official documentation on how to authenticate and use the OpenAI API.
