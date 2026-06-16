// src/main.rs
use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer, Responder};
use handlebars::Handlebars;
use serde::Serialize;
use std::collections::HashMap;

#[derive(Serialize, Clone)]
pub struct TemplateData {
    title: String,
    description: String,
    author: String,
    github_url: String,
    tracking_id: String,
    profile_image: String,
    keywords: String,
    og_title: String,
    og_description: String,
    og_image: String,
    twitter_handle: String,
}

async fn redirect_page(req: HttpRequest) -> impl Responder {
    let data = TemplateData {
        title: "Obot Obo - Software Developer & Quant".to_string(),
        description: "Obot Obo - Software Developer & Quant building innovative digital solutions".to_string(),
        author: "Obot Obo".to_string(),
        github_url: "https://github.com/oboobotenefiok".to_string(),
        tracking_id: "G-M89WZD35SS".to_string(),
        profile_image: "/vault/img/profile_photo.png".to_string(),
        keywords: "software developer, quant, web development, AI, trading systems".to_string(),
        og_title: "Obot Obo - Software Developer & Quant".to_string(),
        og_description: "Building innovative digital solutions".to_string(),
        og_image: "/vault/img/profile_photo.png".to_string(),
        twitter_handle: "oboobotenefiok".to_string(),
    };

    let mut handlebars = Handlebars::new();
    handlebars.register_template_string("redirect", include_str!("../templates/redirect.html"))
        .unwrap();

    let rendered = handlebars.render("redirect", &data).unwrap();
    HttpResponse::Ok().content_type("text/html").body(rendered)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    println!("Starting MASH Redirect Server at http://localhost:8080");

    HttpServer::new(|| {
        App::new()
            .route("/", web::get().to(redirect_page))
            .route("/index.html", web::get().to(redirect_page))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}