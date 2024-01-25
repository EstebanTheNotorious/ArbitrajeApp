import { LayoutProvider } from "../layout/contexto/layoutcontext";
import { BubbleProvider } from "../providers/bubblecontext";
import { SessionProvider } from "../providers/sessioncontext";
import { EventProvider } from "../providers/eventContext";
import Layout from "../layout/layout";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../styles/layout/layout.scss";
import "../styles/shared/shared.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-multi-carousel/lib/styles.css";
import "swiper/swiper-bundle.css";


export default function MyApp({ Component, pageProps }) {
  if (Component.getLayout) {
    return (
      <LayoutProvider>
        {Component.getLayout(<Component {...pageProps} />)}
      </LayoutProvider>
    );
  } else {
    return (
      <SessionProvider>
        <BubbleProvider>
          <EventProvider>
            <LayoutProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </LayoutProvider>
          </EventProvider>
        </BubbleProvider>
      </SessionProvider>
    );
  }
}
