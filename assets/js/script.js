window.addEventListener("load", (event) => {
  // Note: some RSS feeds can't be loaded in the browser due to CORS security.
  // To get around this, you can use a proxy.
  const CORS_PROXY = "https://corsanywhere.herokuapp.com/";
  const url = `${CORS_PROXY}https://www.meetup.com/Blackout-Squad/events/ical`;
  const container = document.querySelector(".bs-component.table-responsive");
  let markup = "";

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((response) => {
      const jcal = ICAL.parse(response);
      const events = jcal[2]
        .filter((item) => item[0] === "vevent")
        .map((event) =>
          event[1].reduce((prev, curr) => {
            prev[curr.slice(0, 1)[0]] = curr.slice(-1)[0];
            return prev;
          }, {})
        );
      markup = events.reduce(function (markup, item) {
        return `${markup}
                  <tr>
                      <th scope="row"><a href="${item.url}" target="_blank">${item.summary}</a></th>
                      <td class="text-right">${new Date(
                        `${item.dtstart}.000Z`
                      ).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}</td>
                  </tr>`;
      }, markup);
    })
    .catch((err) => {
      markup =
        '<tr class="table-info"><td>Unable to load any events, please try again later</td></tr>';
    })
    .finally(() => {
      if (container) {
        container.innerHTML = `
                    <table class="table w-100 d-block d-md-table">
                          ${markup}
                    </table>
                    `;
      }
    });
});
