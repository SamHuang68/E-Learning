import { LocaleToggle, useI18n } from '../i18n/i18n'

type Props = {
  onBack: () => void
}

export function PrivacyPage({ onBack }: Props) {
  const { t } = useI18n()
  return (
    <main className="privacy-page">
      <div className="privacy-toolbar">
        <button type="button" className="hub-back privacy-back" onClick={onBack}>
          {t('privacy.back')}
        </button>
        <LocaleToggle />
      </div>
      <header className="hub-hero">
        <p className="eyebrow">{t('privacy.eyebrow')}</p>
        <h1>{t('privacy.title')}</h1>
        <p className="lede">
          {t('privacy.lede')}
        </p>
      </header>

      <section className="privacy-block">
        <h2>{t('privacy.localTitle')}</h2>
        <p>{t('privacy.localP')}</p>
        <ul>
          <li>{t('privacy.local.1')}</li>
          <li>{t('privacy.local.2')}</li>
          <li>{t('privacy.local.3')}</li>
          <li>{t('privacy.local.4')}</li>
          <li>{t('privacy.local.5')}</li>
          <li>{t('privacy.local.6')}</li>
        </ul>
      </section>

      <section className="privacy-block">
        <h2>{t('privacy.cloudTitle')}</h2>
        <p>{t('privacy.cloudP')}</p>
        <ul>
          <li>{t('privacy.cloud.1')}</li>
          <li>{t('privacy.cloud.2')}</li>
          <li>{t('privacy.cloud.3')}</li>
        </ul>
      </section>

      <section className="privacy-block">
        <h2>{t('privacy.noUploadTitle')}</h2>
        <ul>
          <li>{t('privacy.noUpload.1')}</li>
          <li>{t('privacy.noUpload.2')}</li>
          <li>{t('privacy.noUpload.3')}</li>
        </ul>
      </section>

      <section className="privacy-block">
        <h2>{t('privacy.thirdTitle')}</h2>
        <ul>
          <li>{t('privacy.third.1')}</li>
          <li>{t('privacy.third.2')}</li>
          <li>{t('privacy.third.3')}</li>
        </ul>
      </section>

      <section className="privacy-block">
        <h2>{t('privacy.controlTitle')}</h2>
        <p>{t('privacy.controlP')}</p>
      </section>
      <section className="privacy-block">
        <h2>{t('privacy.devTitle')}</h2>
        <p>{t('privacy.devP')}</p>
        <p>
          👉 <a href="https://github.com/SamHuang68/E-Learning" target="_blank" rel="noopener noreferrer"><strong>{t('privacy.devLink')}</strong></a>
        </p>
      </section>
    </main>
  )
}
