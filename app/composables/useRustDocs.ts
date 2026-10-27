// Shared data for the Rust docs: the usage snippets (rsx!) and a source
// lookup, so every Rust category page stays in step.
const RUST_USAGE: Record<string, string> = {
  AdsButton: `AdsButton { variant: ButtonVariant::Accent, icon: "plus", "New crawl" }
AdsButton { variant: ButtonVariant::Quiet, "Cancel" }
// Destructive pins the button to the default weight, whatever the variant.
AdsButton { destructive: true, onclick: move |_| delete_project(), "Delete project" }`,
  AdsIconButton: `AdsIconButton { icon: "mail", label: "Email" }`,
  AdsSegmented: `AdsSegmented {
    label: "Range",
    options: vec![SegOption::new("24h", "24h"), SegOption::new("7d", "7d"), SegOption::new("30d", "30d")],
    selected: range(),
    onselect: move |v| range.set(v),
}`,
  AdsTabs: `AdsTabs {
    label: "Links",
    controls: "results",
    tabs: vec![SegOption::new("Internal", "internal"), SegOption::new("External", "external")],
    selected: tab(),
    onselect: move |v| tab.set(v),
}`,
  AdsMenu: `AdsMenu {
    label: "Row actions",
    items: vec![
        MenuItem::with_icon("Duplicate", "layers").shortcut("⌘D"),
        MenuItem::with_icon("Delete", "alert").destructive(),
    ],
    onaction: move |label: String| run(label),
}`,
  AdsField: `AdsField {
    label: "Email",
    field_type: FieldType::Email,
    value: email(),
    placeholder: "you@studio.com",
    hint: "We never share it.",
    oninput: move |e: FormEvent| email.set(e.value()),
}`,
  AdsDaterange: `AdsDaterange {
    from: "2026-09-25",
    to: "2026-10-25",
    selected: preset(),
    onselect: move |p| preset.set(p),
}`,
  AdsChoice: `AdsChoice { label: "I agree to the terms", checked: agree(), onchange: move |v| agree.set(v) }
AdsChoice { kind: ChoiceKind::Switch, label: "Email me" }`,
  AdsRange: `AdsRange { label: "Concurrency", value: range(), oninput: move |v| range.set(v) }`,
  AdsNumber: `AdsNumber { label: "Count", value: n(), min: 0, max: 10, oninput: move |v| n.set(v) }`,
  AdsTag: `AdsTag { label: "status: 4xx", onremove: move |_| remove_filter("status: 4xx") }`,
  AdsBadge: `AdsBadge { value: "5", label: "unread" }`,
  AdsStatus: `AdsStatus { label: "Critical", grade: 4 }
AdsStatus { label: "Job failed", tone: StatusTone::Bad }`,
  AdsDelta: `AdsDelta { value: "12.4%", direction: DeltaDirection::Up }`,
  AdsStat: `AdsStat { value: "1,284", label: "URLs crawled", delta: "+37", direction: DeltaDirection::Up }
AdsStat { value: "74", label: "Median latency", unit: "ms", previous: "84" }`,
  AdsMeter: `AdsMeter { value: 68, threshold: 80, label: "Budget used", unit: "%" }`,
  AdsProgress: `AdsProgress { value: 46, label: "Crawling" }`,
  AdsDl: `AdsDl { items: vec![("Status".into(), "200 · indexable".into())] }`,
  AdsDataGrid: `AdsDataGrid {
    columns: vec![
        GridColumn::new("name", "Page").mono(),
        GridColumn::new("views", "Views"),
        GridColumn::new("sev", "Severity").grade(),
    ],
    rows: vec![vec!["/overview".into(), "18,240".into(), "1".into()]],
    caption: "Top pages",
    onselect: move |(row, i): (Vec<String>, usize)| open_drawer(row, i),
}`,
  AdsAccordion: `AdsAccordion { items: vec![("Why grey?".into(), "…".into())] }`,
  AdsSteps: `AdsSteps { steps: vec![Step::new("Configure", StepState::Done), Step::new("Audit", StepState::Now)] }`,
  AdsTree: `AdsTree { nodes: vec![TreeNode::leaf("/").with_children(vec![TreeNode::leaf("blog").with_count(842)])] }`,
  AdsCrumbs: `AdsCrumbs { items: vec![Crumb::link("Projects", "/"), Crumb::link("CrawlStat", "/crawlstat"), Crumb::new("Results")] }`,
  AdsPager: `AdsPager { page: page(), pages: 12, onchange: move |n| page.set(n) }`,
  AdsEmpty: `AdsEmpty { title: "No crawls yet", body: "Results appear here once a crawl has finished.",
    AdsButton { variant: ButtonVariant::Accent, size: ButtonSize::Sm, icon: "plus", "New crawl" }
}
AdsEmpty { kind: EmptyKind::NoResults, title: "Nothing matches these filters",
    AdsButton { size: ButtonSize::Sm, onclick: move |_| clear_filters(), "Clear filters" }
}`,
  AdsSkeleton: `AdsSkeleton { width: "100%", height: "14px" }
AdsSkeleton { width: "64px", height: "22px", pill: true }`,
  AdsLoading: `AdsLoading { text: "Recrawling 311 URLs…" }`,
  AdsBanner: `AdsBanner { text: "This crawl is 14 days old." }
AdsBanner { tone: BannerTone::Bad, text: "The last crawl failed: robots.txt blocked it.",
    actions: rsx! { AdsButton { size: ButtonSize::Sm, "Retry" } },
}`,
  AdsModal: `AdsModal { open: open(), title: "Delete this project?", onclose: move |()| open.set(false),
    p { class: "ink-subdued", "This cannot be undone." }
    AdsButton { destructive: true, onclick: move |_| delete_project(), "Delete project" }
    AdsButton { variant: ButtonVariant::Quiet, onclick: move |_| open.set(false), "Cancel" }
}`,
  AdsTooltip: `AdsTooltip { text: "Internal links pointing here", id: "tip-links",
    button { class: "btn btn-quiet btn-sm", "aria-describedby": "tip-links", "Inlinks" }
}`,
  AdsDrawer: `AdsDrawer {
    title: "Page detail",
    open: row().is_some(),
    onclose: move |()| row.set(None),
    panel: rsx! { AdsDl { items: detail } },
    AdsDataGrid { columns, rows, onselect: move |(r, _): (Vec<String>, usize)| row.set(Some(r)) }
}`,
  AdsPopover: `AdsPopover {
    trigger_label: "What is link score?",
    label: "Link score",
    body: "A 0–100 measure of internal link value.",
    link: PopoverLink::new("How it is computed", "/docs/link-score"),
}`,
  AdsToastHost: `// Keep the list yourself; mount the host once, near the root.
let mut toasts = use_signal(Vec::<Toast>::new);
AdsToastHost {
    toasts: toasts(),
    ondismiss: move |id| toasts.write().retain(|t| t.id != id),
}
// Push a confirmation — never an error, which is a banner:
toasts.write().push(Toast::new(1, "Export finished · 733 rows").icon(ToastIcon::Check));`,
  AdsThemeToggle: `AdsThemeToggle { dark: dark(), onclick: move |_| dark.toggle() }`,
  BrandMark: `BrandMark { size: 40 }`,
  FrameTab: `FrameTab { items: vec!["Projects".into(), "Results".into(), "Issues".into()], active: 1,
    "The frame"
}`,
  Wordmark: `Wordmark { text: "Artelier", size: 18 }`,
  ProjectLogo: `ProjectLogo { word: "C", size: 76 }`,
  RevealHeading: `RevealHeading {
    lines: vec!["Less, but".into(), "done well.".into()],
    tag: HeadingLevel::H1,
    size: RevealSize::Display,
}`,
  LocalTime: `LocalTime { city: "Colorado Springs", time: "09:41", open: true }`,
  BlogMeta: `BlogMeta { tag: "Design", date: "2026-10-12", reading_time: 6 }`,
  Marquee: `Marquee { items: vec!["Dashboards".into(), "Design systems".into(), "Data products".into()] }`,
  PalettePanel: `PalettePanel {
    pigments: vec![
        Pigment::new("Tyrian", "Primary", PigmentToken::BrandPrimary),
        Pigment::new("Verdigris", "Secondary", PigmentToken::BrandSecondary),
        Pigment::new("Vermilion", "Danger", PigmentToken::Bad),
    ],
}`,
  ThemeLab: `// Controlled: keep the values, apply them to the root.
ThemeLab {
    theme: theme(),
    density: density(),
    radius: radius(),
    depth: depth(),
    ontheme: move |t| theme.set(t),
    ondensity: move |d| density.set(d),
    onradius: move |r| radius.set(r),
    ondepth: move |d| depth.set(d),
    onreset: move |()| { theme.set(ThemeMode::Light); density.set(Density::Comfortable); radius.set(20.0); depth.set(1.0) },
}
div { "data-theme": theme().as_str(), style: theme_lab_tokens(radius(), depth(), density()), … }`,
  DashShell: `DashShell {
    sections: vec![Section::new("overview", "Overview", "dashboard").tab()],
    active: active(),
    onselect: move |i| active.set(i),
    pages: AppPage::site(),
    path: "/dashboard-example",
    dark: dark(),
    ontheme: move |_| dark.toggle(),
    onsearch: move |()| palette.set(true),
    // The page itself
}`,
  MobileNav: `// DashShell renders this for you; alone, outside the shell:
MobileNav {
    sections,
    active: active(),
    onselect: move |i| active.set(i),
    path: "/",
    onsearch: move |()| palette.set(true),
}`,
  CommandPalette: `CommandPalette {
    open: palette(),
    commands: vec![
        Command::new("overview", "Sections", "Overview", "dashboard").hint("#overview"),
        Command::new("contact", "Pages", "Start a project", "mail"),
    ],
    onclose: move |()| palette.set(false),
    onselect: move |id: String| go(id),
}`,
  Icon: `Icon { name: "chart", size: 24 }`,
  AdsBars: `AdsBars { data: vec![("Mon".into(), 42.0), ("Tue".into(), 58.0)], label: "Crawls by weekday" }`,
  AdsSparkline: `AdsSparkline { points: vec![12.0, 19.0, 15.0, 24.0], label: "Sessions, last 7 weeks" }`,
  AdsGauge: `AdsGauge { value: 68, threshold: 80, label: "coverage", unit: "%" }`,
  AdsHeatmap: `AdsHeatmap {
    values: vec![vec![0.0, 4.0, 12.0], vec![3.0, 0.0, 40.0]],
    label: "Crawl errors by weekday and hour",
    row_labels: vec!["Mon".into(), "Tue".into()],
}`,
  ChartChoice: `ChartChoice {}`,
  GanttChart: `GanttChart { weeks: 8 }`,
  CountUp: `CountUp { to: 1284 }`,
  DashEmpty: `DashEmpty {
    title: "No results for these filters",
    status: DashEmptyStatus::NoResults,
    action_label: "Clear filters",
    onaction: move |_| clear_filters(),
}`,
  KpiRow: `KpiRow {
    stats: vec![
        StatItem::new("1,284", "URLs").delta("+37", DeltaDirection::Up),
        StatItem::new("98", "Health").target("100"),
    ],
}`,
  FilterBar: `FilterBar {
    query: query(),
    onquery: move |q| query.set(q),
    tags: vec!["Exec summary".into()],
    segment: segment(),
    onsegment: move |s| segment.set(s),
}`,
  TableScreen: `TableScreen {
    title: "Results",
    count: "733 rows",
    tabs: vec!["Internal".into(), "External".into()],
    tab: tab(),
    ontab: move |t| tab.set(t),
    columns: cols,
    rows: rows,
    onselect: move |(row, i): (Vec<String>, usize)| open_drawer(row, i),
}`,
  SummaryDetail: `SummaryDetail {}`,
  AdsTypography: `AdsTypography { role: "display", "Less, but done well." }`,
  AdsAspectRatio: `AdsAspectRatio { ratio: "16 / 9", … }`,
  AdsLabel: `AdsLabel { "Email address" }`,
  AdsKbd: `AdsKbd { keys: vec!["⌘".into(), "K".into()] }`,
  AdsCodeBlock: `AdsCodeBlock { code: "const n = 42" }`,
  AdsMarker: `AdsMarker { label: "Live", color: "var(--ok)" }`,
  AdsDirection: `AdsDirection { to: "down" }`,
  AdsItem: `AdsItem { icon: "chart", "Audience overview" }`,
  AdsBubble: `AdsBubble { "Hello from the studio." }`,
  AdsInputGroup: `AdsInputGroup { prefix: "€", suffix: "/mo", placeholder: "0" }`,
  AdsInputOtp: `AdsInputOtp { length: 6 }`,
  AdsNativeSelect: `AdsNativeSelect { options: vec![("desktop".into(), "Desktop".into())] }`,
  AdsSelect: `AdsSelect { options: vec![("monthly".into(), "Monthly".into())] }`,
  AdsCombobox: `AdsCombobox { options: vec![("crawlstat".into(), "CrawlStat".into())] }`,
  AdsAttachment: `AdsAttachment { name: "report.pdf", size: "1.2 MB" }`,
  AdsHoverCard: `AdsHoverCard { trigger: rsx! { AdsButton { variant: ButtonVariant::Quiet, "Hover" } }, "The card." }`,
  AdsSheet: `AdsSheet { open: true, side: "right", title: "Details", "…" }`,
  AdsContextMenu: `AdsContextMenu { items: vec!["Rename".into(), "Delete".into()] }`,
  AdsMenubar: `AdsMenubar { items: vec![MenubarItem::group("File", vec![MenubarItem::link("New", "/")])] }`,
  AdsNavMenu: `AdsNavMenu { links: vec![MenubarItem::group("Work", vec![MenubarItem::link("CrawlStat", "/")])] }`,
  AdsCalendar: `AdsCalendar { month_label: "October" }`,
  AdsCarousel: `AdsCarousel { …slides… }`,
  AdsTrace: `AdsTrace { steps: vec![TraceStep::new("Discovery", "done").meta("wk 1")] }`,
  AdsQuestionnaire: `AdsQuestionnaire { questions: vec![Question::new("q1", "What do you need?", vec!["A site".into()])] }`,
  AdsResizable: `AdsResizable { "Drag the edge." }`,
  AdsScrollArea: `AdsScrollArea { height: "180px", … }`,
  AdsSpinner: `AdsSpinner { size: 22 }`,
  AdsMessage: `AdsMessage { name: "Studio", time: "09:41", "The crawl finished." }`,
  AdsMessageScroller: `AdsMessageScroller { … }`,
  SiteNav: `SiteNav {
    links: vec![NavLink::new("Overview", "/"), NavLink::new("Dashboard", "/dashboard")],
    cta_to: "/contact",
    cta_label: "Start a project",
    home_label: "Artelier home",
    current: "/",
    dark,
    ontheme: move |_| toggle_theme(),
}`,
  SiteFooter: `SiteFooter {
    year: 2026,
    domain: "artelier.agency",
    owner: "Clotaire",
    owner_href: "https://clotairedamy.com",
    links: vec![NavLink::new("Dashboard", "/dashboard"), NavLink::new("Privacy", "/privacy")],
}`,
  HeroSection: `HeroSection {
    eyebrow: "Studio",
    title: "The dashboard your users live in",
    lead: "Grey chrome, coloured data.",
    actions: rsx! {
        a { class: "btn btn-accent", href: "/contact", "Start a project" }
        a { class: "btn", href: "/work", "See the work" }
    },
    visual: rsx! { AppWindow { src: "/shot.png", alt: "The results table" } },
}`,
  ContentSection: `ContentSection { eyebrow: "Why", title: "What we do", lead: "…",
    FeatureGrid { features }
}`,
  ImageSection: `ImageSection { eyebrow: "Soft UI", title: "Depth is the only decoration", body: "…", flip: true,
    img { src: "/shot.png", alt: "The results table" }
}`,
  FeatureGrid: `FeatureGrid { features: vec![Feature::new("chart", "Charts", "Hand-drawn.")], columns: 3 }`,
  LogoMarquee: `LogoMarquee { names: vec!["CrawlStat".into(), "Artelier".into()] }`,
  PricingSection: `PricingSection {
    plans: vec![
        Plan::new("Starter", "€900", "For a first crawl.", "Choose Starter").period("/mo")
            .features(vec!["One site".into(), "Monthly crawl".into()]),
        Plan::new("Studio", "€2,400", "Ongoing.", "Start a project").period("/mo")
            .features(vec!["Unlimited sites".into()]).featured(),
    ],
    featured_label: "Recommended",
    onselect: move |plan: Plan| choose(plan),
}`,
  FaqSection: `FaqSection { faqs: vec![Faq::new("Why is the chrome grey?", "So colour means something when it appears.")] }`,
  CtaBand: `CtaBand {
    eyebrow: "New project",
    title: "Build the dashboard your users live in",
    body: "Every price is public.",
    cta_label: "Get a price",
    cta_to: "/contact",
    secondary_label: "Send a message",
    secondary_to: "/contact",
}`,
  ContactForm: `ContactForm { privacy_to: "/privacy", onsubmit: move |m: ContactMessage| send(m) }`,
  DocShell: `DocShell {
    aside: rsx! { DocNav { groups } },
    article { "The reading column." }
}`,
  DocNav: `DocNav {
    home: NavLink::new("Help centre", "/docs"),
    groups: vec![DocGroup::new("Getting started", vec![DocPage::new("Installing", "/docs/installing")])],
    current: "/docs/installing",
}`,
  Callout: `Callout { callout_type: CalloutType::Tip, "A tip worth knowing." }`,
  AppWindow: `AppWindow { src: "/shot.png", alt: "The results table" }`,
  Screenshot: `Screenshot { src: "/shot.png", alt: "The results table", caption: "Every URL, with its status." }`,
  ScreenTour: `ScreenTour {
    screens: vec![TourScreen::new("overview", "Overview", "The week at a glance", "…")],
    active: active(),
    onchange: move |i| active.set(i),
    AppWindow { src: "/overview.png", alt: "The overview" }
}`,
  StatementSection: `StatementSection {
    lines: vec!["Less, but".into(), "done well.".into()],
    facts: vec![("Founded".into(), "2019".into())],
}`,
  StorySection: `StorySection { body: vec!["…".into()], more: vec!["…".into()] }`,
  WorkList: `WorkList { items: vec![WorkItem::new("CrawlStat", "Product", "A crawler that reads like a report.").href("/work/crawlstat")] }`,
  WorkSection: `WorkSection { items: vec![WorkCard::new("CrawlStat", "Product", "…").tags(vec!["Rust".into()]).href("https://crawlstat.com")] }`,
}

export function useRustDocs() {
  const { files } = useRustSource()
  function source(path: string): string {
    return files.find((f) => f.path === path)?.content ?? ''
  }
  return { usage: RUST_USAGE, source }
}
