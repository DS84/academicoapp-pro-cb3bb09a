import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContactSectionProps {
  language: string;
}

const ContactSection = ({ language }: ContactSectionProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      hours: {
        title: 'Office Hours',
        weekdays: 'Monday to Friday: 8:00 AM - 6:00 PM',
        weekend: 'Saturday: 9:00 AM - 2:00 PM'
      }
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: language === 'pt' ? 'Erro' : 'Error',
        description: language === 'pt' ? 'Por favor, preencha todos os campos.' : 'Please fill in all fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: language === 'pt' ? 'Sucesso' : 'Success',
        description: language === 'pt' 
          ? 'Mensagem enviada com sucesso! Entraremos em contacto brevemente.' 
          : 'Message sent successfully! We will contact you shortly.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending contact email:', error);
      toast({
        title: language === 'pt' ? 'Erro' : 'Error',
        description: language === 'pt' 
          ? 'Erro ao enviar mensagem. Tente novamente mais tarde.' 
          : 'Error sending message. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t.form.name}
                    className="h-12"
                    required
                  />
                </div>
                <div>
                  <Input 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t.form.email}
                    className="h-12"
                    required
                  />
                </div>
                <div>
                  <Input 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={t.form.subject}
                    className="h-12"
                    required
                  />
                </div>
                <div>
                  <Textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t.form.message}
                    className="min-h-32 resize-none"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? (language === 'pt' ? 'Enviando...' : 'Sending...') : t.form.send}
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