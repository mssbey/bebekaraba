'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  title: string;
  slug: string;
  items: FaqItem[];
}

function AccordionRow({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-[#EDE9E4] rounded-2xl bg-white overflow-hidden transition-shadow hover:shadow-sm">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 sm:px-6 sm:py-5"
      >
        <span className="font-semibold text-sm sm:text-base text-navy-900">{item.question}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-orange-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm leading-relaxed text-charcoal/60">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqAccordion({ categories }: { categories: FaqCategory[] }) {
  const [openKey, setOpenKey] = useState<string | null>(`0-0`);

  return (
    <div className="flex flex-col gap-12">
      {categories.map((category, ci) => (
        <section key={category.title} id={category.slug} className="scroll-mt-28">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy-900 mb-5">{category.title}</h2>
          <div className="flex flex-col gap-3">
            {category.items.map((item, ii) => {
              const key = `${ci}-${ii}`;
              return (
                <AccordionRow
                  key={key}
                  item={item}
                  isOpen={openKey === key}
                  onToggle={() => setOpenKey(openKey === key ? null : key)}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
