import { currencyFormatter } from "src/utils";

export default {
  methods: {
    formatCurrency(value) {
      return currencyFormatter().format(value);
    },
  },
};
