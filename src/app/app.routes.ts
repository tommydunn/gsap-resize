import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: 'team/:slug', component: TeamDetailComponent },
  { path: 'team', component: HomeComponent },
  // { path: 'jobs/:slug', component: JobDetailComponent },
  { path: 'jobs', component: HomeComponent },
  // { path: 'services', component: ServicesComponent },
  // { path: 'cases/:slug', component: CasesDetailComponent },
  // { path: 'cases', component: CasesComponent },
  // { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
  // { path: 'privacy-policy', component: PrivacyPolicyComponent },
  // { path: 'legal-notice', component: LegalNoticeComponent },
  // { path: '404', component: PageNotFoundComponent },
  // { path: '**', redirectTo: '/404' },
];
