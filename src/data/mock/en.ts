export type MockQuestion = {
  id: string
  prompt: string
  choices: string[]
  answer: string
  tag: 'part5' | 'listening' | 'reading'
}

export const enMockQuestions: MockQuestion[] = [
  {
    id: 'en-m-01',
    prompt: 'Part 5: The office ___ at 9 a.m.',
    choices: ['opens', 'open', 'opening', 'to open'],
    answer: 'opens',
    tag: 'part5',
  },
  {
    id: 'en-m-02',
    prompt: 'Listening: "Your appointment is confirmed for Monday." What is confirmed?',
    choices: ['An appointment', 'A payment', 'A shipment', 'A complaint'],
    answer: 'An appointment',
    tag: 'listening',
  },
  {
    id: 'en-m-03',
    prompt: 'Reading: "The coupon expires on July 31." What happens after July 31?',
    choices: ['The coupon cannot be used.', 'The store opens.', 'The price drops.', 'The item ships.'],
    answer: 'The coupon cannot be used.',
    tag: 'reading',
  },
  {
    id: 'en-m-04',
    prompt: 'Part 5: Please contact Ms. Chen ___ you have questions.',
    choices: ['if', 'and', 'so', 'until'],
    answer: 'if',
    tag: 'part5',
  },
  {
    id: 'en-m-05',
    prompt: 'Listening: "The flight has been delayed by thirty minutes." What changed?',
    choices: ['Departure time', 'Ticket price', 'Gate number', 'Passenger name'],
    answer: 'Departure time',
    tag: 'listening',
  },
  {
    id: 'en-m-06',
    prompt: 'Reading: "All employees must wear ID badges." Who needs badges?',
    choices: ['All employees', 'Only visitors', 'Managers only', 'Customers'],
    answer: 'All employees',
    tag: 'reading',
  },
  {
    id: 'en-m-07',
    prompt: 'Part 5: The sales team is responsible ___ the quarterly report.',
    choices: ['for', 'to', 'with', 'at'],
    answer: 'for',
    tag: 'part5',
  },
  {
    id: 'en-m-08',
    prompt: 'Listening: "Could you repeat the last figure?" What does the speaker need?',
    choices: ['A number repeated', 'A new chair', 'A printed map', 'A later meeting'],
    answer: 'A number repeated',
    tag: 'listening',
  },
  {
    id: 'en-m-09',
    prompt: 'Reading: "Registration is required in advance." What should people do?',
    choices: ['Sign up early', 'Arrive late', 'Pay after the event', 'Bring a guest'],
    answer: 'Sign up early',
    tag: 'reading',
  },
  {
    id: 'en-m-10',
    prompt: 'Part 5: The product was designed ___ small businesses.',
    choices: ['for', 'by', 'during', 'over'],
    answer: 'for',
    tag: 'part5',
  },
  {
    id: 'en-m-11',
    prompt: 'Listening: "Let us reschedule for Thursday afternoon." What will happen?',
    choices: ['The meeting time will change.', 'The project will end.', 'The client will pay.', 'The room is full.'],
    answer: 'The meeting time will change.',
    tag: 'listening',
  },
  {
    id: 'en-m-12',
    prompt: 'Reading: "The warranty covers parts but not labor." What is not covered?',
    choices: ['Labor', 'Parts', 'The manual', 'Shipping labels'],
    answer: 'Labor',
    tag: 'reading',
  },
]
