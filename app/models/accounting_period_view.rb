class AccountingPeriodView < ApplicationRecord
  self.table_name = :accounting_periods_view
  belongs_to :user
end
