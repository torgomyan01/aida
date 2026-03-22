import { AnalysisExampleSection } from './how-it-works/analysis-example-section';
import { DashboardsSection } from './how-it-works/dashboards-section';
import { ExpertsSection } from './how-it-works/experts-section';
import { WorksBannerSection } from './how-it-works/works-banner-section';

export function LandingHowItWorksSections() {
  return (
    <>
      <WorksBannerSection />
      <AnalysisExampleSection />
      <DashboardsSection />
      <ExpertsSection />
    </>
  );
}
