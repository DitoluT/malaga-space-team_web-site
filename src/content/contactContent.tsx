import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GlassContainer } from '../components/GlassContainer';
import { GlassButton } from '../components/GlassButton';
import { sendEmail } from '../utils/emailService';

// Form state interface
interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Form status type
type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export const ContactFormWithEmailJS: React.FC = () => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const { name, email, subject, message } = formState;
    return !!(name.trim() && email.trim() && subject.trim() && message.trim());
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatus('error');
      setErrorMessage(t('contact.form.validation.required'));
      return;
    }

    if (!formRef.current) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      await sendEmail(formRef.current);
      setStatus('success');
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : t('contact.form.error'));
      console.error('EmailJS error:', error);
    }
  };

  return (
    <section id="contacto" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <GlassContainer className="section-glass mb-16">
          <div className="p-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">{t('contact.title')}</h2>
            <p className="text-lg text-white/80">
              {t('contact.description')}
            </p>
          </div>
        </GlassContainer>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <GlassContainer className="contact-info-glass">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">{t('contact.contactInfo')}</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-lg">
                    <Mail className="w-6 h-6 text-white/90" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">{t('contact.coordination')}</h4>
                    <p className="text-blue-300 font-semibold">spaceteam@uma.es</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-lg">
                    <Phone className="w-6 h-6 text-white/90" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">{t('contact.phone')}</h4>
                    <p className="text-green-300 font-semibold">+34 952 13 71 00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-lg">
                    <MapPin className="w-6 h-6 text-white/90" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">{t('contact.location')}</h4>
                    <p className="text-purple-300 font-semibold">{t('contact.address')}</p>
                    <p className="text-white/70">{t('contact.city')}</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassContainer>

          {/* Contact Form */}
          <GlassContainer className="contact-form-glass">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">{t('contact.form.title')}</h3>
              
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">{t('contact.form.name')}</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder={t('contact.form.namePlaceholder')}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">{t('contact.form.email')}</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder={t('contact.form.emailPlaceholder')}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">{t('contact.form.subject')}</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formState.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder={t('contact.form.subjectPlaceholder')}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">{t('contact.form.message')}</label>
                  <textarea 
                    rows={4}
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                    placeholder={t('contact.form.messagePlaceholder')}
                    required
                  />
                </div>

                {/* Status Messages */}
                {status === 'success' && (
                  <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
                    {t('contact.form.success')}
                  </div>
                )}
                
                {status === 'error' && (
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                    {errorMessage}
                  </div>
                )}
                
                <GlassButton 
                  variant="primary" 
                  size="lg" 
                  type="submit"
                  disabled={status === 'loading'}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Send className="w-5 h-5" />
                    <span>
                      {status === 'loading' ? t('contact.form.loading') : t('contact.form.submit')}
                    </span>
                  </div>
                </GlassButton>
              </form>
            </div>
          </GlassContainer>
        </div>
      </div>
    </section>
  );
};