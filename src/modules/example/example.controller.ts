import type { ExampleService } from './example.service'
import { Controller, Get } from '@nestjs/common'

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) { }

  @Get('test')
  async test() {
    return this.exampleService.test()
  }
}
