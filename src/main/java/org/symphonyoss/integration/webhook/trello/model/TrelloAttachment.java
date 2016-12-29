/**
 * Copyright 2016-2017 Symphony Integrations - Symphony LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.symphonyoss.integration.webhook.trello.model;

import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.ATTACHMENT;
import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.ID;
import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.INTEGRATION_NAME;
import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.NAME;
import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.URL;

import com.fasterxml.jackson.databind.JsonNode;
import org.symphonyoss.integration.entity.Entity;
import org.symphonyoss.integration.entity.EntityBuilder;

import java.net.URI;
import java.net.URISyntaxException;

/**
 * Constructs a Attachment entity from a Attachment JSON node contained on Trello payloads.
 * Created by rsanchez on 28/09/16.
 */
public class TrelloAttachment {

  private JsonNode rootNode;

  /**
   * Constructs a Attachment entity from a Attachment JSON node contained on Trello payloads.
   * @param rootNode Attachment root node from Trello
   */
  public TrelloAttachment(JsonNode rootNode) {
    this.rootNode = rootNode;
  }

  /**
   * Getter for Attachment id.
   * @return Attachment id.
   */
  public String getId() {
    return rootNode.path(ID).asText();
  }

  /**
   * Getter for Attachment name.
   * @return Attachment name.
   */
  public String getName() {
    return rootNode.path(NAME).asText();
  }

  /**
   * Getter for Attachment URL at Trello.
   * @return Attachment URL at Trello.
   */
  public URI getURL() {
    try {
      return new URI(rootNode.path(URL).asText());
    } catch (URISyntaxException e) {
      return null;
    }
  }

  /**
   * Builds the Attachment entity from Trello payload data.
   * @return Attachment entity with id, name, and URL.
   * <pre>
   * {@code
   * <entity type="com.symphony.integration.trello.attachment" version="1.0">
   *   <attribute name="url" type="com.symphony.uri" value="https://trello-attachments.s3
   *   .amazonaws.com/57a34f3e36e1e889b0dfca55/57ea99ab4e60503af5708af4
   *   /913038ddab9acabb7fb26ae1f5b57878/blue-winged-warbler.jpg"/>
   *   <attribute name="name" type="org.symphonyoss.string" value="blue-winged-warbler.jpg"/>
   *   <attribute name="id" type="org.symphonyoss.string" value="57ea9ab2924953d49d6b61bd"/>
   * </entity>
   * }
   * </pre>
   */
  public Entity toEntity() {
    return EntityBuilder.forNestedEntity(INTEGRATION_NAME, ATTACHMENT)
        .attributeIfNotNull(URL, getURL())
        .attribute(NAME, getName())
        .attribute(ID, getId())
        .build();
  }

}
