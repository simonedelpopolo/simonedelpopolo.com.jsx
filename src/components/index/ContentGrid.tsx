import { css } from '@nutsloop/neonjsx';

interface GridItem {
  title: string;
  description: string;
  link: string;
}

interface ContentSection {
  id: string;
  title: string;
  items: GridItem[];
}

interface ContentGridProps {
  sections: ContentSection[];
}

export const ContentGrid = ( props: ContentGridProps ) => {
  /* component styles */
  css( './css/components/index/content-grid.css' );

  return (
    <div class="content-grid">
      {props.sections.map( section => (
        <section id={section.id} class="content-grid__section">
          <h2 class="content-grid__category">{section.title}</h2>
          <div class="content-grid__items">
            {section.items.map( item => (
              <article class="content-grid__card">
                <h3 class="content-grid__card-title">
                  <a href={item.link} class="content-grid__card-link">
                    {item.title}
                  </a>
                </h3>
                <p class="content-grid__card-description">{item.description}</p>
              </article>
            ) )}
          </div>
        </section>
      ) )}
    </div>
  );
};
