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

package org.symphonyoss.integration.webhook.trello.parser;

import com.fasterxml.jackson.databind.JsonNode;
import org.symphonyoss.integration.model.config.IntegrationInstance;

import java.util.List;

/**
 * Interface that defines methods to validate Trello messages
 * Created by rsanchez on 08/09/16.
 */
public interface TrelloParser {

  List<String> getEvents();

  boolean filterNotifications(IntegrationInstance instance, JsonNode payload);

  String parse(IntegrationInstance instance, JsonNode node) throws TrelloParserException;

  void setTrelloUser(String trelloUser);
}
