import React from 'react';
import Badge from '../ui/Badge';
import Section from '../ui/Section';
import { CheckCircle } from 'lucide-react';

const Programs = () => {
  const ProgramCard = ({ title, age, desc, img, features, reverse }) => (
    <div className={`flex flex-col md:flex-row ${reverse ? 'md:flex-row-reverse' : ''} gap-12 items-center mb-24`}>
      <div className="md:w-1/2 relative group">
        <div className={`absolute inset-0 bg-purple-600 rounded-3xl transform ${reverse ? '-rotate-3' : 'rotate-3'} group-hover:rotate-0 transition duration-500 opacity-20`}></div>
        <img
          src={img}
          alt={title}
          className="rounded-3xl shadow-2xl relative z-10 w-full object-cover h-[400px]"
        />
      </div>
      <div className="md:w-1/2">
        <Badge color="bg-purple-100 text-purple-800 border border-purple-200 mb-4 inline-block">{age}</Badge>
        <h2 className="text-4xl font-bold text-slate-900 mb-6">{title}</h2>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">{desc}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-700 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <CheckCircle size={20} className="text-green-500 flex-shrink-0" /> <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Section id="programs" className="bg-slate-50 -mt-20 relative z-20 rounded-t-[3rem]">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Core Programs</h2>
        <p className="text-slate-500">Tailored care for every stage of development.</p>
      </div>

      <ProgramCard
        title="1. Nurturing Day Care"
        age="6 months - 3 years"
        desc="A safe haven for your little ones while you work. We prioritize emotional security, sensory play, and routine monitoring to ensure your child feels at home."
        img="https://images.unsplash.com/photo-1544947936-a36746cfdf31?auto=format&fit=crop&q=80"
        features={['Real-time Diaper/Feed Logs', 'Sensory Development', 'Organic Meal Plans', 'Secure Nap Rooms']}
      />

      <ProgramCard
        title="2. Pre-School Excellence"
        age="3 years - 5 years"
        desc="Preparing young minds for the future. Our curriculum balances academic foundations like phonics and math with crucial social skills and creative expression."
        img="https://images.unsplash.com/photo-1576400883215-05fae3e15777?auto=format&fit=crop&q=80"
        features={['Early Literacy & STEM', 'Social Group Dynamics', 'Creative Arts Studio', 'School Readiness']}
        reverse={true}
      />

      <ProgramCard
        title="3. Professional Nanny Service"
        age="All Ages (Home Service)"
        desc="Need extra help at home? KiddoZ allows you to book certified, background-checked nannies for evening care, weekends, or emergency support."
        img="https://images.unsplash.com/photo-1627733475990-2e4a42867c26?auto=format&fit=crop&q=80"
        features={['Background Checked', 'First Aid Certified', 'Flexible Booking', 'App-Based Tracking']}
      />
    </Section>
  );
};

export default Programs;