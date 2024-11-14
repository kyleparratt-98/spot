// @ts-ignore
import radius from "radius";
import dgram from "dgram";

interface AuthRequest {
  username: string;
  password: string;
}

const RADIUS_SERVER_IP = "127.0.0.1";
const RADIUS_SERVER_PORT = 1812;
const SHARED_SECRET = "testing123";

export async function authenticateUser({
  username,
  password,
}: AuthRequest): Promise<boolean> {
  console.log(
    `Starting RADIUS authentication to ${RADIUS_SERVER_IP}:${RADIUS_SERVER_PORT}...`
  );

  const packet = radius.encode({
    code: "Access-Request",
    secret: SHARED_SECRET,
    attributes: [
      ["User-Name", username],
      ["User-Password", password],
      ["NAS-IP-Address", "127.0.0.1"],
      ["NAS-Port-Type", "Wireless-802.11"],
      ["Service-Type", "Login-User"],
    ],
  });

  return new Promise((resolve, reject) => {
    const client = dgram.createSocket("udp4");

    client.on("listening", () => {
      const address = client.address();
      console.log(`RADIUS client bound to ${address.address}:${address.port}`);

      client.send(packet, RADIUS_SERVER_PORT, RADIUS_SERVER_IP, (error) => {
        if (error) {
          console.error("Send error:", error);
          client.close();
          reject(error);
        } else {
          console.log("RADIUS request sent successfully");
        }
      });
    });

    client.on("message", (msg, rinfo) => {
      console.log(`Received response from ${rinfo.address}:${rinfo.port}`);
      try {
        const response = radius.decode({
          packet: msg,
          secret: SHARED_SECRET,
        });
        console.log("Decoded RADIUS response:", response);
        client.close();
        resolve(response.code === "Access-Accept");
      } catch (error) {
        console.error("Failed to decode RADIUS response:", error);
        client.close();
        reject(error);
      }
    });

    client.on("error", (error) => {
      console.error("Socket error:", error);
      client.close();
      reject(error);
    });

    client.bind();

    setTimeout(() => {
      console.log("RADIUS request timed out");
      client.close();
      reject(new Error("Timeout waiting for RADIUS response"));
    }, 10000);
  });
}
