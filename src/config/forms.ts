import rawForms from '../data/forms.json'

type TallyFormConfig = {
  formId: string
  shareUrl: string
  embedMinHeight?: number
}

type FormRegistry = {
  mainGetInTouch: TallyFormConfig
  freeGetAccessNow: TallyFormConfig
}

export const forms = rawForms as FormRegistry
