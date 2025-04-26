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
}

variable "ssh_key_fingerprint" {
  description = "Fingerprint of the SSH key to add to the droplet"
  type        = string
}

provider "digitalocean" {
  token = var.digitalocean_token
}

resource "digitalocean_droplet" "my_droplet" {
  name   = "Hackops"
  region = "blr1"
  size   = "s-1vcpu-1gb"
  image  = "ubuntu-20-04-x64"
  ssh_keys = [var.ssh_key_fingerprint]

  connection {
    type        = "ssh"
    user        = "root"
    host        = self.ipv4_address
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y docker.io",
      "sudo systemctl start docker",
      "sudo systemctl enable docker"
    ]
  }
}

output "droplet_public_ip" {
  value = digitalocean_droplet.my_droplet.ipv4_address
}