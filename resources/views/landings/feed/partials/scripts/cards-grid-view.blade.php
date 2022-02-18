<script>
                const renderHits = (renderOptions, isFirstRender) => {
            const { hits, widgetParams } = renderOptions;

            widgetParams.container.innerHTML = 
                `<div class="container feed-grid__container">
                        ${hits
                            .map(
                            item =>
                            `
                            <a href="/feed/${item.certificate_number}/view">
                                <div class="feed-grid__grid-view">
                                        <div class="feed-grid__top-section">
                                            <aside class = "feed-grid__text">
                                                <h1 class="feed-grid__card-name">${item.card_name}</h1>
                                                <p class="feed-grid__card-long-name">${item.searchable_name}</p>
                                            </aside>
                                            <aside class = "feed-grid__grade">
                                                <p class = "feed-grid__grade-nickname">${item.grade_nickname}</p>
                                                <p class = "feed-grid__overall-grade">${item.overall_grade}</p>
                                            </aside>
                                        </div>
                                        <div class="feed-grid__image-section">
                                            <img 
                                                class="feed-grid__image" 
                                                src="${item.card_image}" 
                                                alt="${item.card_name}"
                                            >
                                        </div>
                                        <div class="feed-grid__bottom-section">
                                            <p class="feed-grid__graded-date">
                                                Date Graded: ${ new Date(item.graded_at).getDate()+'-'+(new Date(item.graded_at).getMonth()+1)+'-'+new Date(item.graded_at).getFullYear()}
                                                at ${new Date(item.graded_at).getHours() % 12 +':'+ new Date(item.graded_at).getMinutes()}
                                                   ${new Date(item.graded_at).getHours() >= 12 ? 'pm' : 'am'}
                                            </p>
                                            <p class="feed-grid__certificate">Certificate #: ${item.certificate_number}</p>
                                            <p class="feed-grid__owner-name">Owner: ${item.owner_name}</p>
                                        </div>
                                </div>
                            </a>
                            `
                            )
                            .join('')}
                </div>`;
            };

            const customHits = instantsearch.connectors.connectHits(renderHits);

            search.addWidgets([
                customHits({
                    container: document.querySelector('.hits'),
                })
            ]);
</script>
