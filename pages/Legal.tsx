import React from 'react';
import { Shield, Info, Mail, MessageCircle } from 'lucide-react';

const Legal: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">About & Policies</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Everything you need to know about ToolBox.</p>
      </div>

      <div className="grid gap-8">
        
        {/* About Section */}
        <section id="about" className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
           <div className="flex items-center gap-3 mb-4 text-brand-600">
             <Info size={28} />
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">About ToolBox</h2>
           </div>
           <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
             <p>
               ToolBox is a free, student-focused utility platform designed to make document and file management effortless. 
               We believe in privacy-first technology. That's why our tools are built to process files <strong>locally in your browser</strong>. 
               Your documents are never uploaded to our servers, ensuring your sensitive data remains on your device.
             </p>
             <p className="mt-4">
               Our mission is to provide accessible, high-speed tools for students, professionals, and everyone in between, completely free of charge.
             </p>
           </div>
        </section>

        {/* Contact & Feedback */}
        <section id="contact" className="grid md:grid-cols-2 gap-8">
           <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4 text-blue-600">
                <Mail size={24} />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contact Us</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Have questions, suggestions, or need support? We'd love to hear from you.
              </p>
              <a href="mailto:support@toolbox.app" className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                support@toolbox.app
              </a>
           </div>

           <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4 text-green-600">
                <MessageCircle size={24} />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Feedback</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Your feedback helps us improve. If you encounter a bug or have a feature request, please email us directly at the contact address provided.
              </p>
           </div>
        </section>

        {/* Policies */}
        <section id="policies" className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
           <div className="flex items-center gap-3 mb-6 text-purple-600">
             <Shield size={28} />
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Policies & Compliance</h2>
           </div>
           
           <div className="space-y-6 text-slate-600 dark:text-slate-300">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Privacy Policy</h3>
                <p>
                  We prioritize your privacy. ToolBox operates primarily as a browser-based utility platform. 
                  <strong>We do not store, view, or share your uploaded files.</strong>
                  All file processing (PDF merging, compression, conversion, editing, etc.) happens within your browser using client-side code.
                </p>
                <p className="mt-3">
                  We may collect anonymous site usage data for analytics and performance monitoring. This data is used only to improve the product and is not linked to personally identifiable information.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Ads & Google AdSense Compliance</h3>
                <p>
                  This site may display advertisements through Google AdSense or other authorized advertising networks. We comply with Google's program policies and maintain a safe, user-friendly experience.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                /*   <li><strong>Ads.txt:</strong> A valid `ads.txt` file is published at <a href="/ads.txt" className="text-brand-600 hover:text-brand-500">https://letterflow.online/ads.txt</a> to declare authorized sellers.</li> */
                   <li><strong>Invalid Traffic:</strong> We do not generate, buy, or encourage invalid clicks or impressions.</li>
                   <li><strong>Ad Placement:</strong> Ads are positioned to avoid accidental clicks and do not interfere with normal tool usage.</li>
                   <li><strong>Content Requirements:</strong> We do not host adult, violent, illegal, hate speech, or other prohibited content.</li>
                   <li><strong>AdSense Policies:</strong> We adhere to the Google Publisher Policies, including data usage, disclosure, and ad behavior requirements.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Cookies & Tracking</h3>
                <p>
                  This website may use cookies and browser storage for essential site functions, analytics, and preferences. No sensitive personal information is stored in cookies. You can manage cookies through your browser settings.
                </p>
                <p className="mt-3">
                  If third-party services such as Google Analytics are used, they are configured for aggregate analytics only and not used to identify individuals.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Copyright and User Responsibility</h3>
                <p>
                  Users are responsible for the content they upload or process using ToolBox. You must have the right to use any documents, images, or text you provide.
                  We do not claim ownership of user content, and we are not responsible for copyright infringement or misuse of uploaded files.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Terms of Service</h3>
                <p>
                  By using ToolBox, you agree that all tools are provided "as is" without warranty. We are not liable for any data loss, corruption, or damages resulting from use of the site. Always keep backups of your original files.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Contact & Compliance Requests</h3>
                <p>
                  For any policy questions, copyright concerns, or AdSense compliance inquiries, please contact us at <a href="mailto:support@toolbox.app" className="text-brand-600 hover:text-brand-500">support@toolbox.app</a>.
                </p>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
};

export default Legal;
