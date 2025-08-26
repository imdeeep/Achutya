import { useState } from 'react';
import { Link } from 'react-router';
import { submitEnquiry, type EnquiryFormData } from '~/services/enquiryApi';
import Button from '~/components/ui/Button';
import SectionHeader from '~/components/ui/SectionHeader';
import Card from '~/components/ui/Card';
import Container from '~/components/ui/Container';

export default function ContactSection() {
  const [formData, setFormData] = useState<EnquiryFormData>({
    name: '',
    phoneNumber: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const result = await submitEnquiry(formData);

      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          phoneNumber: '',
          email: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 to-blue-50">
      <Container>
        <SectionHeader
          title="Wanderlust Calling?"
          subtitle="Allow Us to Call You Back!"
        />

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Section - Illustration */}
            <div className="relative">
              <div className="bg-teal-500 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                {/* Smartphone */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-48 h-80 bg-yellow-400 rounded-3xl relative shadow-2xl transform rotate-12">
                    {/* Phone screen icons */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-4">
                      <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                      <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                      <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">@</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Characters */}
                <div className="absolute bottom-4 left-4">
                  <div className="w-16 h-16 bg-blue-300 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                  </div>
                </div>

                <div className="absolute bottom-8 right-8">
                  <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-yellow-600 rounded-full"></div>
                  </div>
                </div>

                {/* Envelope */}
                <div className="absolute bottom-2 left-2">
                  <div className="w-20 h-16 bg-blue-300 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">WANDERON</span>
                  </div>
                </div>

                {/* Background elements */}
                <div className="absolute top-4 right-4 w-8 h-8 border-2 border-white/20 rounded-full"></div>
                <div className="absolute top-16 right-8 w-6 h-6 border-2 border-white/20 rounded-full"></div>
                <div className="absolute bottom-16 left-8 w-4 h-4 border-2 border-white/20 rounded-full"></div>
              </div>
            </div>

            {/* Right Section - Contact Form */}
            <Card shadow="xl" hover={false}>
              <div className="p-8">
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    Thank you! Your enquiry has been submitted successfully. We'll contact you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 text-black">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. John Smith"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your 10 digit number"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Id *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Any Message"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition-colors duration-200"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    {loading ? 'Submitting...' : 'Submit Enquiry'}
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
} 