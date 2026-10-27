//! Dashboard patterns (KPI row, filter bar, table screen, summary → detail).

pub mod docs;
pub mod filter_bar;
pub mod kpi_row;
pub mod screen_tour;
pub mod sections;
pub mod statement;
pub mod story;
pub mod summary_detail;
pub mod table_screen;
pub mod work_list;
pub mod work_section;

pub use docs::{AppWindow, Callout, DocGroup, DocNav, DocShell, Screenshot};
pub use filter_bar::FilterBar;
pub use kpi_row::KpiRow;
pub use screen_tour::{ScreenTour, TourScreen};
pub use sections::{
    ContactForm, ContentSection, CtaBand, Faq, FaqSection, Feature, FeatureGrid, FooterColumn,
    HeroSection, ImageSection, LogoMarquee, NavLink, Plan, PricingSection, SiteFooter, SiteNav,
};
pub use statement::StatementSection;
pub use story::StorySection;
pub use summary_detail::SummaryDetail;
pub use table_screen::TableScreen;
pub use work_list::{WorkItem, WorkList};
pub use work_section::{WorkCard, WorkSection};
