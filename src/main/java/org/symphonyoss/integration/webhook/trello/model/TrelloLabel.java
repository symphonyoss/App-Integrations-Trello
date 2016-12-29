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

import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.COLOR;
import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.ID;
import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.INTEGRATION_NAME;
import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.LABEL;
import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.NAME;

import com.fasterxml.jackson.databind.JsonNode;
import org.symphonyoss.integration.entity.Entity;
import org.symphonyoss.integration.entity.EntityBuilder;

/**
 * Constructs a Label entity from a Label JSON node contained on Trello payloads.
 * Created by rsanchez on 09/09/16.
 */
public class TrelloLabel {

  private JsonNode rootNode;

  /**
   * Constructs a Label entity from a Label JSON node contained on Trello payloads.
   * @param rootNode Card root node from Trello
   */
  public TrelloLabel(JsonNode rootNode) {
    this.rootNode = rootNode;
  }

  /**
   * Getter for Label id.
   * @return Label id.
   */
  public String getId() {
    return rootNode.path(ID).asText();
  }

  /**
   * Getter for Label name.
   * @return Label name.
   */
  public String getName() {
    return rootNode.path(NAME).asText();
  }

  /**
   * Getter for Label color.
   * @return Label color.
   */
  public String getColor() {
    return rootNode.path(COLOR).asText();
  }

  /**
   * Builds the Label entity from Trello payload data.
   * @return Label entity with id, name, and color.
   * <pre>
   * {@code
   * <entity type="com.symphony.integration.trello.label" version="1.0">
   *   <attribute name="color" type="org.symphonyoss.string" value="black" />
   *   <attribute name="name" type="org.symphonyoss.string" value="Black label" />
   *   <attribute name="id" type="org.symphonyoss.string" value="57a34b3384e677fd36cc13b8" />
   * </entity>
   * }
   * </pre>
   */
  public Entity toEntity() {
    EntityBuilder builder = EntityBuilder.forNestedEntity(INTEGRATION_NAME, LABEL)
        .attribute(COLOR, getColor())
        .attribute(NAME, getName())
        .attribute(ID, getId());
    return builder.build();
  }
}
