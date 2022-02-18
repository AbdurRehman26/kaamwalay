<script>
            // Create the render function
            const createDataAttribtues = refinement =>
            Object.keys(refinement)
                .map(key => `data-${key}="${refinement[key]}"`)
                .join(' ');

            const renderListItem = item => `
            <li>
                <ul>
                ${item.refinements
                    .map(
                    refinement =>
                        `<li class="feed-stats__current-refinements-list">
                        ${refinement.label}
                        <button class="feed-stats__current-refinements-button" ${createDataAttribtues(refinement)}>X</button>
                        </li>`
                    )
                    .join('')}
                </ul>
            </li>
            `;

            const renderCurrentRefinements = (renderOptions, isFirstRender) => {
            const { items, refine, widgetParams } = renderOptions;

            widgetParams.container.innerHTML = `
                <ul>
                ${items.map(renderListItem).join('')}
                </ul>
            `;

            [...widgetParams.container.querySelectorAll('button')].forEach(element => {
                element.addEventListener('click', event => {
                const item = Object.keys(event.currentTarget.dataset).reduce(
                    (acc, key) => ({
                    ...acc,
                    [key]: event.currentTarget.dataset[key],
                    }),
                    {}
                );

                refine(item);
                });
            });
            };

            const customCurrentRefinements = instantsearch.connectors.connectCurrentRefinements(
            renderCurrentRefinements
            );

            search.addWidgets([
            customCurrentRefinements({
                container: document.querySelector('.feed-stats__current-refinements'),
            })
            ]);
</script>
