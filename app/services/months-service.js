import Service, { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

const monthDate = function(date) {
  let monthDate = new Date(date.getTime());
  monthDate.setHours(0, 0, 0, 0);
  monthDate.setDate(1);

  return monthDate;
};

export default Service.extend({
  store: service(),

  async findCurrentMonth() {
    return await this.findMonthByDate(new Date());
  },

  async findMonthByDate(dateObj) {
    const date = monthDate(dateObj);
    const months = await this.get("store").findAll("month");

    let monthByDate = months.find(month => {
      return month.get("date").getTime() === date.getTime();
    });

    if (!monthByDate) {
      const user = (await this.get("store").findAll("user")).get("firstObject");
      monthByDate = await run(() => {
        return this.get("store")
          .createRecord("month", {
            date,
            openingBalance: user.get("currentBalance")
          })
          .save();
      });
    }

    return monthByDate;
  }
});
