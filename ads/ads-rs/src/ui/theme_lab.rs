//! Theme lab — live token controls (theme, density, radius, depth).

use dioxus::prelude::*;

/// The token controls. Controlled: the parent applies the values to its own
/// tokens (`--radius`, `--soft-raised*`, `--gutter`, `--row-h`).
#[component]
pub fn ThemeLab(
    #[props(into, optional)] theme: Option<String>,
    #[props(into, optional)] density: Option<String>,
    #[props(default = 20.0f32)] radius: f32,
    #[props(default = 1.0f32)] depth: f32,
    #[props(optional)] ontheme: Option<EventHandler<String>>,
    #[props(optional)] ondensity: Option<EventHandler<String>>,
    #[props(optional)] onradius: Option<EventHandler<f32>>,
    #[props(optional)] ondepth: Option<EventHandler<f32>>,
    #[props(optional)] onreset: Option<EventHandler<MouseEvent>>,
) -> Element {
    let theme = theme.unwrap_or_else(|| "light".to_string());
    let density = density.unwrap_or_else(|| "comfortable".to_string());

    rsx! {
        div { class: "lab card",
            div { class: "lab-head",
                div {
                    span { class: "eyebrow", "Live tokens" }
                    h3 { class: "h3", "Retheme this page." }
                }
                button { class: "btn btn-quiet", r#type: "button", onclick: move |e| { if let Some(h) = &onreset { h.call(e); } }, "Reset" }
            }
            div { class: "controls",
                div { class: "control",
                    label { class: "eyebrow", "Theme" }
                    div { class: "segmented",
                        for t in ["light", "dark"] {
                            button {
                                r#type: "button",
                                class: if theme == t { "on" } else { "" },
                                onclick: { let h = ontheme.clone(); let v = t.to_string(); move |_| { if let Some(h) = &h { h.call(v.clone()); } } },
                                "{t}"
                            }
                        }
                    }
                }
                div { class: "control",
                    label { class: "eyebrow", "Density" }
                    div { class: "segmented",
                        for d in ["comfortable", "compact"] {
                            button {
                                r#type: "button",
                                class: if density == d { "on" } else { "" },
                                onclick: { let h = ondensity.clone(); let v = d.to_string(); move |_| { if let Some(h) = &h { h.call(v.clone()); } } },
                                "{d}"
                            }
                        }
                    }
                }
                div { class: "control",
                    label { class: "eyebrow", "Corner radius {radius}px" }
                    input { r#type: "range", min: "4", max: "34", step: "1", value: "{radius}", oninput: move |e| { if let Some(h) = &onradius { if let Ok(v) = e.value().parse::<f32>() { h.call(v); } } } }
                }
                div { class: "control",
                    label { class: "eyebrow", "Shadow depth {depth:.2}×" }
                    input { r#type: "range", min: "0", max: "2", step: "0.05", value: "{depth}", oninput: move |e| { if let Some(h) = &ondepth { if let Ok(v) = e.value().parse::<f32>() { h.call(v); } } } }
                }
            }
            p { class: "body foot", "Four properties, one stylesheet, every surface on the site." }
        }
    }
}
