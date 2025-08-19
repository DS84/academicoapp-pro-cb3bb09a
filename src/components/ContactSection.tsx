import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { FaWhatsapp, FaXTwitter } from 'react-icons/fa6';

interface ContactSectionProps {
  language: string;
}

const ContactSection = ({ language }: ContactSectionProps) => {
  const translations = {
    pt: {
      title: 'Entre em Contacto',
      subtitle: 'Estamos aqui para ajudar no seu percurso educativo e profissional',
      form: {
        name: 'Nome Completo',
        email: 'Email',
        subject: 'Assunto',
        message: 'Mensagem',
        send: 'Enviar Mensagem'
      },
      info: {
        title: 'Informações de Contacto',
        email: 'contacto@academicoapp.com',
        phone: '942065632',
        address: 'Luanda, Angola'
      },
      social: {
        title: 'Redes Sociais',
        whatsapp: 'WhatsApp',
        twitter: 'X (Twitter)'
      },
      hours: {
        title: 'Horário de Atendimento',
        weekdays: 'Segunda a Sexta: 8h00 - 18h00',
        weekend: 'Sábado: 9h00 - 14h00'
      }
    },
    en: {
      title: 'Get in Touch',
      subtitle: 'We are here to help with your educational and professional journey',
      form: {
        name: 'Full Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        send: 'Send Message'
      },
      info: {
        title: 'Contact Information',
        email: 'contacto@academicoapp.com',
        phone: '942065632',
        address: 'Luanda, Angola'
      },
      social: {
        title: 'Social Media',
        whatsapp: 'WhatsApp',
        twitter: 'X (Twitter)'
      },
      hours: {
        title: 'Office Hours',
        weekdays: 'Monday to Friday: 8:00 AM - 6:00 PM',
        weekend: 'Saturday: 9:00 AM - 2:00 PM'
      }
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <section id="contact" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="border-0 shadow-card">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div>
                  <Input 
                    placeholder={t.form.name}
                    className="h-12"
                  />
                </div>
                <div>
                  <Input 
                    type="email"
                    placeholder={t.form.email}
                    className="h-12"
                  />
                </div>
                <div>
                  <Input 
                    placeholder={t.form.subject}
                    className="h-12"
                  />
                </div>
                <div>
                  <Textarea 
                    placeholder={t.form.message}
                    className="min-h-32 resize-none"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {t.form.send}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="border-0 shadow-card">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-primary mb-6">{t.info.title}</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <span className="text-foreground">{t.info.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <span className="text-foreground">{t.info.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <span className="text-foreground">{t.info.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-primary mb-6">{t.social.title}</h3>
                <div className="space-y-4">
                  <a 
                    href="https://wa.me/244942065632" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 hover:bg-accent/5 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <FaWhatsapp className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="text-foreground">{t.social.whatsapp}</span>
                  </a>
                  <a 
                    href="https://x.com/academicoapp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 hover:bg-accent/5 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-slate-500/10 rounded-lg flex items-center justify-center">
                      <FaXTwitter className="h-5 w-5 text-slate-500" />
                    </div>
                    <span className="text-foreground">{t.social.twitter}</span>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-primary mb-4">{t.hours.title}</h3>
                <div className="space-y-2">
                  <p className="text-muted-foreground">{t.hours.weekdays}</p>
                  <p className="text-muted-foreground">{t.hours.weekend}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;