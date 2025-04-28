terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

variable "digitalocean_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
  # Ensure you provide this via environment variable (TF_VAR_digitalocean_token)
  # or remove the sensitive=true line and put it in terraform.tfvars (less secure)
}

variable "ssh_key_fingerprint" {
  description = "Fingerprint of the SSH key to add to the droplet"
  type        = string
  # Ensure this fingerprint matches a key in your DigitalOcean account
}

provider "digitalocean" {
  token = var.digitalocean_token
}

resource "digitalocean_droplet" "my_droplet" {
  name     = "Hackops"
  region   = "blr1"
  size     = "s-1vcpu-1gb"
  image    = "ubuntu-20-04-x64"
  ssh_keys = [var.ssh_key_fingerprint]

  # User data script to run on first boot
  user_data = <<-EOF
    #!/bin/bash
    set -e # Exit immediately if a command exits with a non-zero status.
    set -x # Print commands and their arguments as they are executed.

    # Ensure apt runs non-interactively
    export DEBIAN_FRONTEND=noninteractive

    # Wait a bit for cloud-init's initial apt run to potentially finish
    # This is a simple way to mitigate potential lock issues, though
    # cloud-init *should* handle this better. You might adjust the sleep time.
    sleep 20

    # Update package lists and install Docker
    apt-get update -y
    apt-get install -y docker.io

    # Start and enable Docker service
    systemctl start docker
    systemctl enable docker

    echo "User data script finished successfully."
  EOF
  # Note: Removed the connection and provisioner blocks
}

output "droplet_public_ip" {
  value = digitalocean_droplet.my_droplet.ipv4_address
}