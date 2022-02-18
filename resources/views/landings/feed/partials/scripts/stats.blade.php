<script>
            const renderStats = (renderOptions, isFirstRender) => {
            const {
                nbHits,
                areHitsSorted,
                nbSortedHits,
                processingTimeMS,
                query,
                widgetParams,
            } = renderOptions;

            if (isFirstRender) {
                return;
            }

            widgetParams.container.innerHTML = `
                ${query ? `Search results for <q>${query}</q>` : ''}
                <p class="feed-stats__total">${nbHits} ${query ? `Results` : `Cards`}</p>`;
            };

            const customStats = instantsearch.connectors.connectStats(renderStats);

            search.addWidgets([
            customStats({
                container: document.querySelector('.feed-stats__text'),
            })
            ]);
</script>
