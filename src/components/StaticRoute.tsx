import { StaticHtmlPage } from "@/components/StaticHtmlPage";
import { staticPages, type StaticPageKey } from "@/content/pages";

type StaticRouteProps = {
  pageKey: StaticPageKey;
};

export function StaticRoute({ pageKey }: StaticRouteProps) {
  const page = staticPages[pageKey];

  return <StaticHtmlPage bodyClassName={page.bodyClassName} html={page.html} />;
}
