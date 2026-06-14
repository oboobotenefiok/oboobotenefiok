use axum::{
    response::{Html, IntoResponse},
    routing::get,
    Router,
};
use maud::{html, DOCTYPE};
use std::path::PathBuf;
use tokio::net::TcpListener;
use tower_http::services::ServeDir;
use tower_http::trace::TraceLayer;

#[tokio::main]
async fn main() {
    // Get the correct static path relative to where the binary runs
    let static_path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("src/static");

    println!(" Serving static files from: {:?}", static_path);
    println!(" MASH stack running on http://localhost:3000");

    let app = Router::new()
        .route("/", get(home))
        .route("/calculator", get(calculator_page))
        .route("/clicktoearn", get(click_to_earn_page))
        .route("/CV", get(cv_page))
        .route("/api/bio-text", get(bio_text_stream))
        .route("/api/gallery-scroll/:project", get(gallery_scroll_fragment))
        .route("/toggle-theme", get(toggle_theme))
        .route("/menu", get(menu_fragment))
        .layer(TraceLayer::new_for_http())
        .nest_service("/static", ServeDir::new(static_path));

    let listener = TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn home() -> Html<String> {
    let markup = html! {
        (DOCTYPE)
        html lang="en" {
            head {
                meta charset="UTF-8";
                meta name="viewport" content="width=device-width, initial-scale=1.0";
                meta name="description" content="Obot Obo - Software Developer & Quant building innovative digital solutions";
                meta name="author" content="Obot Obo";
                title { "Obot Obo – Dev & Quant" }
                link rel="icon" href="/static/img/profile_photo.png" type="image/png";
                link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
                link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
                link rel="stylesheet" href="/static/style.css";
                script src="https://unpkg.com/htmx.org@2.0.0" {}
                script {
                    r#"
                    document.addEventListener('DOMContentLoaded', function() {
                        const savedTheme = localStorage.getItem('theme') || 'light';
                        document.documentElement.setAttribute('data-theme', savedTheme);
                        const toggleBtn = document.getElementById('themeToggle');
                        if (toggleBtn) toggleBtn.textContent = savedTheme === 'light' ? '🌙' : '☀️';
                        
                        // Initialize starfield canvas
                        const canvas = document.getElementById('starfield');
                        if (canvas) {
                            const ctx = canvas.getContext('2d');
                            function resizeCanvas() {
                                canvas.width = window.innerWidth;
                                canvas.height = window.innerHeight;
                            }
                            resizeCanvas();
                            window.addEventListener('resize', resizeCanvas);
                            
                            let stars = [];
                            for (let i = 0; i < 150; i++) {
                                stars.push({
                                    x: Math.random() * canvas.width,
                                    y: Math.random() * canvas.height,
                                    size: Math.random() * 1.2 + 0.3,
                                    speed: Math.random() * 0.3 + 0.1,
                                    opacity: Math.random() * 0.4 + 0.1
                                });
                            }
                            
                            function animateStars() {
                                const theme = document.documentElement.getAttribute('data-theme');
                                if (theme === 'dark') {
                                    ctx.fillStyle = 'rgba(18, 18, 18, 0.9)';
                                } else {
                                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                                }
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                                
                                stars.forEach(star => {
                                    if (theme === 'dark') {
                                        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                                    } else {
                                        ctx.fillStyle = `rgba(0, 0, 0, ${star.opacity * 0.3})`;
                                    }
                                    ctx.beginPath();
                                    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                                    ctx.fill();
                                    star.y += star.speed;
                                    if (star.y > canvas.height) {
                                        star.y = 0;
                                        star.x = Math.random() * canvas.width;
                                    }
                                });
                                requestAnimationFrame(animateStars);
                            }
                            animateStars();
                        }
                    });
                    "# 
                }
            }
            body id="top" {
                canvas id="starfield" {}

                div class="nav-controls" {
                    button id="themeToggle" class="theme-toggle" hx-get="/toggle-theme" hx-swap="none" { "🌙" }
                    button id="hamburger" class="hamburger-btn" hx-get="/menu" hx-target="#dropdownMenu" hx-swap="outerHTML" { "☰" }
                }
                div id="dropdownMenu" class="dropdown-menu" style="display:none;" {}

                div class="cover-photo-container" {
                    div class="cover-photo" {
                        img src="/static/img/cover_photo.png" alt="Cover" style="width:100%; height:100%; object-fit:cover;";
                    }
                }

                div class="profile-section" {
                    div class="profile-photo" {
                        img src="/static/img/profile_photo.png" alt="Profile" style="width:100%; height:100%; border-radius:50%; object-fit:cover;";
                    }
                    div class="profile-info" {
                        h2 { "Obot Obo" }
                        p { "Software Developer & Quant" }
                        p class="bio" id="animated-bio" hx-get="/api/bio-text" hx-trigger="load, every 4s" hx-swap="innerHTML" {}
                    }
                    div class="contact-section" {
                        a href="mailto:oboobotenefiok@gmail.com?subject=Service%20Request&body=Hi%20Obot," class="contact-button hire-me" target="_blank" {
                            "Hire Me " i class="fas fa-envelope" {}
                        }
                        a href="https://x.com/oboobotenefiok" class="contact-button twitter" target="_blank" {
                            i class="fab fa-x-twitter" {}
                        }
                        a href="https://github.com/oboobotenefiok" class="contact-button twitter" target="_blank" {
                            i class="fab fa-github" {}
                        }
                    }
                }

                div class="projects-header" { "Projects & Services" }
                div class="projects-container" {
                    a href="/calculator" {
                        div class="project" {
                            div class="project-title" { "₦ -BASED FX CALCULATOR" }
                            div class="project-description" { "A currency conversion tool specifically designed for the ₦ with real-time exchange rates." }
                            div class="project-gallery" hx-trigger="load, every 3s" hx-get="/api/gallery-scroll/calculator" hx-swap="outerHTML" {
                                (gallery_static("calculator", &["calc_1.png", "calc_2.png", "calc_3.png"]))
                            }
                        }
                    }

                    div class="project" {
                        div class="project-title" { "Quantitative Trading System" }
                        div class="project-description" { "Automated trading system using machine learning to predict market movements and execute trades." }
                        div class="project-gallery" hx-trigger="load, every 3s" hx-get="/api/gallery-scroll/trading" hx-swap="outerHTML" {
                            (gallery_static("trading", &["quant_1.png", "quant_2.png", "quant_3.png"]))
                        }
                    }

                    div class="project" {
                        div class="project-title" { "High Quality Front End Web Development" }
                        div class="project-description" { "Modern, responsive web applications with clean UI/UX design and optimized performance just like this one!" }
                        div class="project-gallery" hx-trigger="load, every 3s" hx-get="/api/gallery-scroll/webdev" hx-swap="outerHTML" {
                            (gallery_static("webdev", &["web_1.png", "web_2.png", "web_3.png"]))
                        }
                    }

                    a href="https://glowfitapp.netlify.app" target="_blank" {
                        div class="project" {
                            div class="project-title" { "GlowFit" }
                            div class="project-description" { "Signup & Login Page for a fitness and wellness app." }
                            div class="project-gallery" hx-trigger="load, every 3s" hx-get="/api/gallery-scroll/glowfit" hx-swap="outerHTML" {
                                (gallery_static("glowfit", &["glow_1.jpg", "glow_2.jpg", "glow_3.jpg"]))
                            }
                        }
                    }

                    div class="project" {
                        div class="project-title" { "AI Research Platform" }
                        div class="project-description" { "A cutting-edge platform for collaborative AI research with real-time model training and visualization tools." }
                        div class="project-gallery" hx-trigger="load, every 3s" hx-get="/api/gallery-scroll/ai-platform" hx-swap="outerHTML" {
                            (gallery_static("ai-platform", &["ai_1.png", "ai_2.png", "ai_3.png"]))
                        }
                    }

                    div class="project" {
                        div class="project-title" { "Computer Vision API" }
                        div class="project-description" { "Scalable API service for image recognition and object detection with customizable models." }
                        div class="project-gallery" hx-trigger="load, every 3s" hx-get="/api/gallery-scroll/vision-api" hx-swap="outerHTML" {
                            (gallery_static("vision-api", &["vision_1.png", "vision_2.png", "vision_3.png"]))
                        }
                    }
                }

                div class="other-projects" {
                    div class="other-projects-header" { "Other Projects" }
                    div class="project" {
                        div class="project-title" { "Automated Documentation Generator" }
                        div class="project-description" { "AI-powered tool that automatically generates technical documentation from code comments and structure." }
                    }
                    div {
                        a class="lock-in" href="#top" { "Back to top" }
                    }
                }
            }
        }
    };
    Html(markup.into_string())
}

fn gallery_static(project: &str, images: &[&str]) -> maud::Markup {
    html! {
        @for (i, &img) in images.iter().enumerate() {
            a href={"/" (project)} class="project-image" {
                img src={"/static/img/" (img)} alt=(project);
                div class="project-image-caption" {
                    @match i {
                        0 => { "Main View" }
                        1 => { "Feature Demo" }
                        _ => { "Additional View" }
                    }
                }
            }
        }
    }
}

async fn gallery_scroll_fragment(
    axum::extract::Path(project): axum::extract::Path<String>,
) -> Html<String> {
    let (images, captions) = match project.as_str() {
        "calculator" => (
            vec!["calc_1.png", "calc_2.png", "calc_3.png"],
            vec!["Converter", "Rates", "History"],
        ),
        "trading" => (
            vec!["quant_1.png", "quant_2.png", "quant_3.png"],
            vec!["Market Analysis", "Dashboard", "Metrics"],
        ),
        "webdev" => (
            vec!["web_1.png", "web_2.png", "web_3.png"],
            vec!["Dashboard", "Mobile", "Interactive"],
        ),
        "glowfit" => (
            vec!["glow_1.jpg", "glow_2.jpg", "glow_3.jpg"],
            vec!["Signup", "Login", "Profile"],
        ),
        "ai-platform" => (
            vec!["ai_1.png", "ai_2.png", "ai_3.png"],
            vec!["Interface", "Training", "Visuals"],
        ),
        "vision-api" => (
            vec!["vision_1.png", "vision_2.png", "vision_3.png"],
            vec!["Architecture", "Detection", "Integration"],
        ),
        _ => (vec!["placeholder.png"], vec!["Coming Soon"]),
    };

    let markup = html! {
        @for (i, img) in images.iter().enumerate() {
            a href={"/" (&project)} class="project-image" {
                img src={"/static/img/" (img)} alt=(&project);
                div class="project-image-caption" { (captions[i]) }
            }
        }
    };
    Html(markup.into_string())
}

async fn bio_text_stream() -> String {
    use rand::seq::SliceRandom;
    let texts = vec![
        "Building innovative digital solutions",
        "A lot is going on in here",
        "Front End Developer",
        "Quantitative Analyst",
        "You either build or sit back watching",
        "Health Technician",
    ];
    texts
        .choose(&mut rand::thread_rng())
        .unwrap_or(&"Building innovative digital solutions")
        .to_string()
}

async fn toggle_theme() -> Html<String> {
    Html(r#"
        <script>
            const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            const toggleBtn = document.getElementById('themeToggle');
            if (toggleBtn) toggleBtn.textContent = newTheme === 'light' ? '🌙' : '☀️';
        </script>
    "#.to_string())
}

async fn menu_fragment() -> Html<String> {
    let markup = html! {
        div class="dropdown-menu" style="display:block;" {
            ul {
                li { a href="/" { "Home" } }
                li { a href="/CV" { "Request CV (Résumé)" } }
                li { a href="/clicktoearn" { "Click To Earn" } }
                li { a href="/calculator" { "Fx Calculator" } }
                li { a href="https://glowfitapp.netlify.app" target="_blank" { "GlowFit" } }
            }
        }
    };
    Html(markup.into_string())
}

async fn calculator_page() -> Html<String> {
    let markup = html! {
        (DOCTYPE)
        html {
            head { title { "₦-Based FX Calculator" } }
            body {
                h1 { "₦-Based FX Calculator" }
                p { "Coming soon — real-time NGN conversion tool" }
                a href="/" { "← Back to Portfolio" }
            }
        }
    };
    Html(markup.into_string())
}

async fn click_to_earn_page() -> Html<String> {
    let markup = html! {
        (DOCTYPE)
        html {
            head { title { "Click To Earn" } }
            body {
                h1 { "Click To Earn" }
                p { "Gamified micro-task platform — launching soon" }
                a href="/" { "← Back to Portfolio" }
            }
        }
    };
    Html(markup.into_string())
}

async fn cv_page() -> Html<String> {
    let markup = html! {
        (DOCTYPE)
        html {
            head { title { "Request CV" } }
            body {
                h1 { "Request My Résumé" }
                p { "Email me directly: " a href="mailto:oboobotenefiok@gmail.com" { "oboobotenefiok@gmail.com" } }
                a href="/" { "← Back to Portfolio" }
            }
        }
    };
    Html(markup.into_string())
}
