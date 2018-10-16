class AuthenticatedController < ApplicationController
  before_action :set_paper_trail_whodunnit
  before_action :authenticate_user!

  before_action :set_raven_context

  private

  def authenticate_user!
    super
    return head(:forbidden) unless current_user
  end

  def set_raven_context
    Raven.user_context(id: current_user.id)
  end
end
