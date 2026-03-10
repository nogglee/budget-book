import { renderCurrentAsset } from "../components/current-asset.js";
import { store, removeHistory } from "../store.js";

const $sectionHistory = document.querySelector(".history");

export function initHistoryList() {
  renderHistoryList();
  addHistoryListEventListener();
}

function addHistoryListEventListener() {
  $sectionHistory.addEventListener("click", function (event) {
    console.log('click!')
    const element = event.target;
    console.log(element)
    if (!element.className.includes("delete-button")) return;

    const { dateid, itemid } = element.dataset;

    const isSuccess = removeHistory(dateid, itemid);
    if (!isSuccess) {
      alert("소비내역 삭제에 실패했습니다.");
      return;
    }

    reRender();
  });
}

function reRender() {
  renderCurrentAsset();
  renderHistoryList();
}

export function renderHistoryList() {

  $sectionHistory.innerHTML = store.dateList
    .sort((a, b) => b.id - a.id)
    .map(({ date, id: dateId }) => {
      const detail = store.detailList[dateId];
      if (!detail?.length) return "";

      
      return `<article class="history-per-day">
      <p class="history-date">2021년 12월 1일</p>
      ${detail.map(({ description, category, amount, fundsAtTheTime, createAt, id }) => {
        
        const time = new Date(createAt).toLocaleTimeString("ko-kr", {hourCycle : "h24", timeStyle : "short"})
        
        return `<section class="history-item">
        <section class="history-item-column">
          <div class="create-at">${time}</div>
          <div class="history-detail">
            <div class="history-detail-row history-detail-title">
              <p>${description}</p>
            </div>
            <div class="history-detail-row history-detail-subtitle">
              <p>${category}</p>
              <p>
                ${amount.toLocaleString()}
                <span>원</span>
              </p>
            </div>
          </div>
          <div class="delete-section">
            <button class="delete-button" data-dateid=${dateId} data-itemid=${id}>🗑</button>
          </div>
        </section>
        <section class="history-item-caption">
          <p>
            <span>남은 자산</span>
            <span>${fundsAtTheTime.toLocaleString()}</span>
            <span>원</span>
          </p>
        </section>
      </section>`
      })
      .join("")
    }
      
    </article>`;
    })
    .join("");
}
