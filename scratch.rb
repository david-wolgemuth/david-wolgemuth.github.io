class OrderCheckoutController < ApplicationController
  def process_payment
    stripe_token = params[:stripe_token]
    stripe_customer = Stripe::Customer.create(
      email: current_user.email,
      source: stripe_token
    )
    charge = Stripe::Charge.create(
      customer: stripe_customer.id,
      amount:   amount,
      currency: "usd"
    )
    redirect_to view_payment_path(charge_id: charge.id), notice: "You've made your payment."
  end

  def view_payment
    @charge = Stripe::Charge.retrieve(params[:charge_id])
  end
end
