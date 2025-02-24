import "/src/index.css";
import InfoCard from "./InfoCard";
import { Scissors, Calendar, Search } from "lucide-react";
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16">
        <h3 className="text-2xl font-semibold mb-6 text-center">{t('howItWorks')}</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <InfoCard
            title={t('find')}
            description={t('discoverSalons')}
            Icon={Search}
          />
          <InfoCard
            title={t('book')}
            description={t('chooseTimeService')}
            Icon={Calendar}
          />
          <InfoCard
            title={t('enjoy')}
            description={t('sitBackRelax')}
            Icon={Scissors}
          />
        </div>
      </section>
    </main>
  );
}

export default About;