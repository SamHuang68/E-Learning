import { CS_QUESTION_COPY_MOCKS } from './csQuestionCopyMocks'
import { CS_QUESTION_COPY_UNIT_1 } from './csQuestionCopyUnit1'
import { CS_QUESTION_COPY_UNIT_2 } from './csQuestionCopyUnit2'
import { CS_QUESTION_COPY_UNIT_3 } from './csQuestionCopyUnit3'
import { CS_QUESTION_COPY_UNIT_4 } from './csQuestionCopyUnit4'
import { CS_QUESTION_COPY_UNIT_5 } from './csQuestionCopyUnit5'
import { CS_QUESTION_COPY_UNIT_6 } from './csQuestionCopyUnit6'
import { CS_QUESTION_COPY_UNIT_7 } from './csQuestionCopyUnit7'
import type { CsQuestionEnglishRegistry } from './csQuestionCopyTypes'

export const CS_QUESTION_COPY_EN: CsQuestionEnglishRegistry = {
  ...CS_QUESTION_COPY_UNIT_1,
  ...CS_QUESTION_COPY_UNIT_2,
  ...CS_QUESTION_COPY_UNIT_3,
  ...CS_QUESTION_COPY_UNIT_4,
  ...CS_QUESTION_COPY_UNIT_5,
  ...CS_QUESTION_COPY_UNIT_6,
  ...CS_QUESTION_COPY_UNIT_7,
  ...CS_QUESTION_COPY_MOCKS,
}
