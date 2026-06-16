use axum::{
    http::StatusCode,
    response::{Html, IntoResponse, Redirect},
    routing::get,
    Router,
};
use maud::{html, DOCTYPE};
use std::net::SocketAddr;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(redirect_handler))
        .route("/vault/img/profile_photo.png", get(profile_image_handler));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = TcpListener::bind(&addr).await.unwrap();

    println!("Redirect server running on http://{}", addr);
    axum::serve(listener, app).await.unwrap();
}

async fn redirect_handler() -> impl IntoResponse {
    let target_url = "https://GitHub.com/oboobotenefiok";

    // HTML with meta refresh and JavaScript redirect (preserves original functionality)
    let html_content = html! {
        (DOCTYPE)
        html lang="en" {
            head {
                // Google Analytics
                script async src="https://www.googletagmanager.com/gtag/js?id=G-M89WZD35SS" {}
                script {
                    "window.dataLayer = window.dataLayer || [];
                    function gtag() { dataLayer.push(arguments); }
                    gtag('js', new Date());
                    gtag('config', 'G-M89WZD35SS');"
                }

                meta charset="UTF-8";
                meta name="viewport" content="width=device-width, initial-scale=1.0";
                meta name="description" content="Obot Obo - Software Developer & Quant building innovative digital solutions";
                meta name="author" content="Obot Obo";
                link rel="author" href="https://oboobotenefiok.netlify.app";
                link rel="me" href="mailto:oboobotenefiok@gmail.com";

                // JSON-LD structured data
                script type="application/ld+json" {
                    (r#"{
                        "@context": "https://schema.org",
                        "@type": "Person",
                        "name": "Obot Obo",
                        "description": "Software Developer & Quant building innovative digital solutions",
                        "url": "https://oboobotenefiok.netlify.app",
                        "email": "oboobotenefiok@gmail.com",
                        "jobTitle": "Software Developer & Quantitative Analyst",
                        "knowsAbout": ["Web Development", "Quantitative Trading", "AI Systems"],
                        "sameAs": [
                            "https://x.com/oboobotenefiok",
                            "https://github.com/oboobotenefiok"
                        ]
                    }"#)
                }

                meta name="keywords" content="software developer, quant, web development, AI, trading systems";
                meta property="og:title" content="Obot Obo - Software Developer & Quant";
                meta property="og:description" content="Building innovative digital solutions";
                meta property="og:image" content="/vault/img/profile_photo.png";
                title { "Obot Obo" }
                link rel="icon" href="/vault/img/profile_photo.png" type="image/png";
                link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet";
                link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
                link rel="stylesheet" href="style.css" type="text/css" media="all";

                // Meta refresh redirect (0 seconds delay)
                meta http-equiv="refresh" content=(format!("0; url={}", target_url));
            }
            body {
                // JavaScript redirect (same as original)
                script {
                    (format!(r#"window.location.href = "{}";"#, target_url))
                }
            }
        }
    };

    // Return HTML with status OK (200)
    (StatusCode::OK, Html(html_content.into_string()))
}

// Handler for the profile image - returns a placeholder or redirects
async fn profile_image_handler() -> impl IntoResponse {
    // Return a simple placeholder image or redirect
    // Since we're redirecting to GitHub, you might want to serve an actual image
    // or just redirect to the GitHub profile
    Redirect::temporary("https://avatars.githubusercontent.com/oboobotenefiok")
}
