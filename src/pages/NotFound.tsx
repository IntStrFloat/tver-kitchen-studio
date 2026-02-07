import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_CONFIG } from "@/lib/seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <>
      <SEOHead
        title="Страница не найдена — 404"
        description="Запрашиваемая страница не найдена. Перейдите на главную страницу TverKuhni для заказа кухни в Твери."
        noindex
      />

      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center max-w-lg">
          <div
            className="text-8xl font-bold text-primary/20 mb-4"
            aria-hidden="true"
          >
            404
          </div>
          <h1 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
            Страница не найдена
          </h1>
          <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
            К сожалению, запрашиваемая страница не существует или была
            перемещена. Воспользуйтесь навигацией ниже, чтобы найти нужную
            информацию.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg">
              <a href="/">
                <Home className="w-5 h-5 mr-2" />
                На главную
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/#catalog">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Каталог кухонь
              </a>
            </Button>
          </div>

          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Или свяжитесь с нами напрямую:
            </p>
            <a
              href={`tel:${SITE_CONFIG.phoneClean}`}
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              <Phone className="w-4 h-4" />
              {SITE_CONFIG.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
