//! Marketing page sections.

use dioxus::prelude::*;

use crate::icons::Icon;
use crate::ui::{AdsAccordion, AdsField, BrandMark};

#[derive(Clone, PartialEq)]
pub struct NavLink {
    pub label: String,
    pub to: String,
}

impl NavLink {
    #[must_use]
    pub fn new(label: impl Into<String>, to: impl Into<String>) -> Self {
        Self { label: label.into(), to: to.into() }
    }
}

#[derive(Clone, PartialEq)]
pub struct FooterColumn {
    pub title: String,
    pub links: Vec<NavLink>,
}

#[derive(Clone, PartialEq)]
pub struct Feature {
    pub icon: String,
    pub title: String,
    pub body: String,
}

impl Feature {
    #[must_use]
    pub fn new(icon: impl Into<String>, title: impl Into<String>, body: impl Into<String>) -> Self {
        Self { icon: icon.into(), title: title.into(), body: body.into() }
    }
}

#[derive(Clone, PartialEq)]
pub struct Plan {
    pub name: String,
    pub price: String,
    pub period: String,
    pub description: String,
    pub features: Vec<String>,
    pub featured: bool,
}

#[derive(Clone, PartialEq)]
pub struct Faq {
    pub q: String,
    pub a: String,
}

/// Site navigation: brand, links, and a CTA.
#[component]
pub fn SiteNav(
    #[props(into, optional)] links: Option<Vec<NavLink>>,
    #[props(into, optional)] cta_to: Option<String>,
    #[props(into, default = "Start a project".to_string())] cta_label: String,
) -> Element {
    let links = links.unwrap_or_default();
    rsx! {
        nav { class: "nav",
            div { class: "bar max",
                a { class: "brand-link", href: "/", BrandMark { size: 30, wordmark: true } }
                div { class: "links",
                    for l in &links { a { class: "link", href: "{l.to}", "{l.label}" } }
                }
                div { class: "actions",
                    a { class: "btn btn-accent btn-sm", href: cta_to.as_deref().unwrap_or("#"), "{cta_label}" }
                }
            }
        }
    }
}

/// Site footer: about line and link columns.
#[component]
pub fn SiteFooter(
    #[props(into, optional)] description: Option<String>,
    #[props(into, optional)] columns: Option<Vec<FooterColumn>>,
) -> Element {
    let description = description.unwrap_or_else(|| "A design and data studio.".to_string());
    let columns = columns.unwrap_or_default();
    rsx! {
        footer { class: "footer",
            div { class: "max inner",
                div { class: "grid",
                    div { class: "about",
                        BrandMark { size: 30, wordmark: true }
                        p { class: "desc", "{description}" }
                    }
                    for c in &columns {
                        div { class: "col",
                            p { class: "eyebrow", "{c.title}" }
                            for l in &c.links { a { class: "link", href: "{l.to}", "{l.label}" } }
                        }
                    }
                }
                div { class: "legal", span { "© Artelier" } }
            }
        }
    }
}

/// A hero: eyebrow, title, lead, and a visual slot.
#[component]
pub fn HeroSection(
    #[props(into, optional)] eyebrow: Option<String>,
    #[props(into)] title: String,
    #[props(into, optional)] lead: Option<String>,
    #[props(into, default = "center".to_string())] align: String,
    children: Element,
) -> Element {
    rsx! {
        section { class: "hero",
            div { class: "max inner", class: if align == "center" { "max inner is-center" } else { "max inner" },
                div { class: "copy",
                    if let Some(e) = &eyebrow { p { class: "eyebrow", "{e}" } }
                    h1 { class: "title face-display", "{title}" }
                    if let Some(l) = &lead { p { class: "lede", "{l}" } }
                }
                div { class: "visual", {children} }
            }
        }
    }
}

/// A content section: head plus body slot.
#[component]
pub fn ContentSection(
    #[props(into, optional)] eyebrow: Option<String>,
    #[props(into)] title: String,
    #[props(into, optional)] lead: Option<String>,
    #[props(into, default = "left".to_string())] align: String,
    children: Element,
) -> Element {
    rsx! {
        section { class: "section",
            div { class: "max inner",
                div { class: "head", class: if align == "center" { "head is-center" } else { "head" },
                    if let Some(e) = &eyebrow { p { class: "eyebrow", "{e}" } }
                    h2 { class: "title", "{title}" }
                    if let Some(l) = &lead { p { class: "lede", "{l}" } }
                }
                div { class: "body", {children} }
            }
        }
    }
}

/// An image section: copy beside a frame.
#[component]
pub fn ImageSection(
    #[props(into, optional)] eyebrow: Option<String>,
    #[props(into)] title: String,
    #[props(into, optional)] body: Option<String>,
    #[props(default = false)] flip: bool,
    children: Element,
) -> Element {
    rsx! {
        section { class: "section",
            div { class: "max inner", class: if flip { "max inner flip" } else { "max inner" },
                div { class: "copy",
                    if let Some(e) = &eyebrow { p { class: "eyebrow", "{e}" } }
                    h2 { class: "title", "{title}" }
                    if let Some(b) = &body { p { class: "body", "{b}" } }
                }
                div { class: "frame", {children} }
            }
        }
    }
}

/// A grid of feature cards.
#[component]
pub fn FeatureGrid(
    #[props(into)] features: Vec<Feature>,
    #[props(default = 3u8)] columns: u8,
) -> Element {
    rsx! {
        div { class: "grid", class: "grid-{columns}",
            for f in &features {
                div { class: "card card-press feat",
                    span { class: "glyph", Icon { name: f.icon.clone(), size: 20 } }
                    h3 { class: "title", "{f.title}" }
                    p { class: "body", "{f.body}" }
                }
            }
        }
    }
}

/// A marquee of wordmarks.
#[component]
pub fn LogoMarquee(
    #[props(into)] names: Vec<String>,
) -> Element {
    rsx! {
        div { class: "marquee",
            div { class: "track",
                div { class: "lane",
                    for n in &names { span { class: "wordmark", "{n}" } }
                }
                div { class: "lane", "aria-hidden": "true",
                    for n in &names { span { class: "wordmark", "{n}" } }
                }
            }
        }
    }
}

/// A pricing grid.
#[component]
pub fn PricingSection(
    #[props(into)] plans: Vec<Plan>,
) -> Element {
    rsx! {
        div { class: "grid plans",
            for p in &plans {
                div { class: "card plan", class: if p.featured { "card plan featured" } else { "card plan" },
                    if p.featured { span { class: "flag", "Featured" } }
                    p { class: "name", "{p.name}" }
                    p { class: "price", span { class: "amount num", "{p.price}" } span { class: "period", "/{p.period}" } }
                    p { class: "desc", "{p.description}" }
                    ul { class: "features",
                        for f in &p.features { li { "{f}" } }
                    }
                    a { class: if p.featured { "btn btn-accent" } else { "btn" }, href: "#", "Choose {p.name}" }
                }
            }
        }
    }
}

/// An FAQ accordion.
#[component]
pub fn FaqSection(
    #[props(into)] faqs: Vec<Faq>,
) -> Element {
    let items = faqs.iter().map(|f| (f.q.clone(), f.a.clone())).collect::<Vec<_>>();
    rsx! {
        div { class: "max faq",
            AdsAccordion { items }
        }
    }
}

/// A call-to-action band.
#[component]
pub fn CtaBand(
    #[props(into, optional)] title: Option<String>,
    #[props(into, optional)] body: Option<String>,
    #[props(into, optional)] cta_label: Option<String>,
    #[props(into, optional)] cta_to: Option<String>,
    #[props(into, optional)] secondary_label: Option<String>,
    #[props(into, optional)] secondary_to: Option<String>,
) -> Element {
    rsx! {
        section { class: "section",
            div { class: "max inner",
                div { class: "cta card",
                    div { class: "copy",
                        if let Some(t) = &title { h2 { class: "title", "{t}" } }
                        if let Some(b) = &body { p { class: "body", "{b}" } }
                    }
                    div { class: "buttons",
                        a { class: "btn btn-accent", href: cta_to.as_deref().unwrap_or("#"), if let Some(l) = &cta_label { "{l}" } }
                        if let Some(s) = &secondary_label { a { class: "btn btn-quiet", href: secondary_to.as_deref().unwrap_or("#"), "{s}" } }
                    }
                }
            }
        }
    }
}

/// A contact form.
#[component]
pub fn ContactForm(
    #[props(into, optional)] submit_label: Option<String>,
) -> Element {
    let submit_label = submit_label.unwrap_or_else(|| "Send".to_string());
    rsx! {
        form { class: "form",
            div { class: "grid-2",
                AdsField { label: "Name", placeholder: "Your name" }
                AdsField { label: "Email", placeholder: "you@studio.com" }
            }
            AdsField { label: "What do you need?", placeholder: "A sentence is enough." }
            button { class: "btn btn-accent submit", r#type: "submit", "{submit_label}" }
        }
    }
}
