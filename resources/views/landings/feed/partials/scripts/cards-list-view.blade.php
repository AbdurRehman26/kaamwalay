<script>
            const renderHitsListView = (renderOptions, isFirstRender) => {
            const { hits, widgetParams } = renderOptions;

            widgetParams.container.innerHTML = 
                `
                        ${hits
                            .map(
                            item =>
                            `<tr class="feed-list__table-row">
                                <td class="feed-list__table-cell feed-list__table-cell--card">
                                    <a href="/feed/${item.certificate_number}/view" class="feed-list__table__info">
                                        <img class="feed-list__table__info-image" src="${item.card_image}" alt="${item.card_name}" width="52" />
                                        <div class="feed-list__table__info-text">
                                            <p class="feed-list__table__info-heading">${item.card_name}</p>
                                            <p class="feed-list__table__info-subheading">${item.searchable_name}</p>
                                            <p class="feed-list__table__info-date">
                                                ${ new Date(item.graded_at).getDate()+'-'+(new Date(item.graded_at).getMonth()+1)+'-'+new Date(item.graded_at).getFullYear()}
                                                ${new Date(item.graded_at).getHours() % 12 +':'+ new Date(item.graded_at).getMinutes()}
                                                ${new Date(item.graded_at).getHours() >= 12 ? 'pm' : 'am'}
                                            </p>
                                        </div>
                                    </a>
                                </td>
                                <td class="feed-list__table-cell feed-list__table-cell--date">
                                    <a href="/feed/${item.certificate_number}/view">
                                    ${ new Date(item.graded_at).getDate()+'-'+(new Date(item.graded_at).getMonth()+1)+'-'+new Date(item.graded_at).getFullYear()}
                                    <br/>
                                    ${new Date(item.graded_at).getHours() % 12 +':'+ new Date(item.graded_at).getMinutes()}
                                    ${new Date(item.graded_at).getHours() >= 12 ? 'pm' : 'am'}
                                    </a>
                                </td>
                                <td class="feed-list__table-cell feed-list__table-cell--certificate">
                                    <a href="/feed/${item.certificate_number}/view">${item.certificate_number}</a>
                                </td>
                                <td class="feed-list__table-cell feed-list__table-cell--owner">
                                    <a href="/feed/${item.certificate_number}/view">${item.owner_name}</a>
                                </td>
                                <td class="feed-list__table-cell feed-list__table-cell--grade">
                                    <a href="/feed/${item.certificate_number}/view" class="feed-list__grade">
                                        <p class="feed-list__grade__label">${item.grade_nickname}</p>
                                        <p class="feed-list__grade__value">${item.overall_grade}</p>
                                    </a>
                                </td>
                            </tr>`
                            )
                            .join('')}
                `;
            };

            const customHitsListView = instantsearch.connectors.connectHits(renderHitsListView);

            search.addWidgets([
                customHitsListView({
                    container: document.querySelector('.list-hits'),
                })
            ]);
</script>
