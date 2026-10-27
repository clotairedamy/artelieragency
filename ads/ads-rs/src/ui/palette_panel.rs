//! Palette panel — the five pigments, at the values each theme uses.

use dioxus::prelude::*;

/// One pigment.
#[derive(Clone, PartialEq)]
pub struct Pigment {
    pub name: String,
    pub role: String,
    pub dark: String,
    pub light: String,
}

impl Pigment {
    #[must_use]
    pub fn new(name: impl Into<String>, role: impl Into<String>, dark: impl Into<String>, light: impl Into<String>) -> Self {
        Self { name: name.into(), role: role.into(), dark: dark.into(), light: light.into() }
    }
}

fn defaults() -> Vec<Pigment> {
    vec![
        Pigment::new("Tyrian", "Primary", "#b66dcc", "#8a4e9c"),
        Pigment::new("Verdigris", "Secondary", "#2b96a4", "#006981"),
        Pigment::new("Celadon", "Success", "#7bc062", "#317905"),
        Pigment::new("Orpiment", "Warning", "#d88c00", "#9d5500"),
        Pigment::new("Vermilion", "Danger", "#e55458", "#9e001f"),
    ]
}

/// The brand and semantic colours — the only hue in the whole system.
#[component]
pub fn PalettePanel(
    #[props(into, optional)] pigments: Option<Vec<Pigment>>,
    #[props(default = 56u32)] entries: u32,
    #[props(default = 12u32)] groups: u32,
) -> Element {
    let pigments = pigments.unwrap_or_else(defaults);
    rsx! {
        div { class: "well palette",
            dl { class: "palette-stats",
                div { dt { class: "num", "{entries}" } dd { "entries" } }
                div { dt { class: "num", "{groups}" } dd { "groups" } }
                div { dt { class: "num", "{pigments.len()}" } dd { "pigments" } }
            }
            ul { class: "palette-swatches",
                for p in &pigments {
                    li { class: "sw", style: "--d:{p.dark};--l:{p.light}",
                        span { class: "sw-chip" }
                        span { class: "sw-name", "{p.name}" }
                        span { class: "sw-role", "{p.role}" }
                    }
                }
            }
        }
    }
}
