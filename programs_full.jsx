import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import Badge from '../ui/Badge';
import Section from '../ui/Section';
import { CheckCircle, ArrowRight } from 'lucide-react'; // Added ArrowRight
import { programsData } from '../../data/programsData';

const Programs = () => {
  const ProgramCard = ({ id, title, age, desc, img, features, reverse }) => (
    <div className={`flex flex-col md:flex-row ${reverse ? 'md:flex-row-reverse' : ''} gap-12 items-center mb-24`}>
      <div className="md:w-1/2 relative group">
        <div className={`absolute inset-0 bg-purple-600 rounded-3xl transform ${reverse ? '-rotate-3' : 'rotate-3'} group-hover:rotate-0 transition duration-500 opacity-20`}></div>
        <Link to={`/programs/${id}`}>
          <img
            src={img}
            alt={title}
            className="rounded-3xl shadow-2xl relative z-10 w-full object-cover h-[400px] cursor-pointer hover:scale-[1.02] transition duration-300"
          />
        </Link>
      </div>
      <div className="md:w-1/2">
        <Badge color="bg-purple-100 text-purple-800 border border-purple-200 mb-4 inline-block">{age}</Badge>
        <Link to={`/programs/${id}`} className="hover:text-purple-700 transition">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">{title}</h2>
        </Link>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">{desc}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {features.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-700 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <CheckCircle size={20} className="text-green-500 flex-shrink-0" /> <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
        <Link to={`/programs/${id}`} className="text-purple-600 font-bold hover:text-purple-800 flex items-center gap-2 group">
          Learn More <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
        </Link>
      </div>
    </div>
  );

  return (
    <Section id="programs" className="bg-slate-50 -mt-20 relative z-20 rounded-t-[3rem]">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Core Programs</h2>
        <p className="text-slate-500">Tailored care for every stage of development.</p>
      </div>

      {programsData.map((program, index) => (
        <ProgramCard
          key={program.id}
          id={program.id}
          title={`${index + 1}. ${program.title}`}
          age={program.age}
          desc={program.shortDesc} // Use shortDesc from data
          img={program.img}
          features={program.features.slice(0, 4)} // Show first 4 features
          reverse={index % 2 !== 0}
        />
      ))}
    </Section>
  );
};

export default Programs;
